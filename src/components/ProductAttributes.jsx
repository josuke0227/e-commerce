import { useState, useEffect, useRef } from "react";
import CustomAutocomplete from "./shared/CustomAutocomplete";
import { getCategories } from "../services/categoryServices";
import { getBrands } from "../services/brandsService";
import { pickByParentId } from "../services/subCategoryServices";

const ProductAttributes = ({
  product,
  value,
  setValue,
  errors,
  subCategory,
  setSubCategory,
}) => {
  // Prevent side effect of reloading subcategory at initial rendering.
  const prevSubCategory = useRef();
  const [options, setOptions] = useState({
    category: [],
    brand: [],
  });
  /*
  separated this option because setOptions({...options, subCategory: data}) 
  because useEffect stats infinite loop when I put options in dependencies array.
  */
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const loadOptions = async (product) => {
      const { data: category } = await getCategories();
      const { data: subCategory } = await pickByParentId(
        product ? product.category._id : category[0]._id
      );
      const { data: brand } = await getBrands();
      setValue({
        category: product ? product.category : category[0],
        brand: product ? product.brand : brand[0],
      });
      setSubCategory(product ? product.subCategory : subCategory[0]);
      setOptions({
        category,
        subCategory,
        brand,
      });
      setSubCategories(subCategory);
    };
    if (!product) {
      loadOptions();
      return;
    }
    loadOptions(product);
  }, [product, setSubCategory, setValue]);

  // Prevent Autocomplete from throwing warning.
  const cleanUpAutocomplete = (name) => {
    if (name === "subCategory") {
      setSubCategories([]);
      setSubCategory("");
      return;
    }
    setOptions({ ...options, [name]: [] });
    setValue({ ...value, [name]: "" });
    return;
  };

  const refreshAutocomplete = (name, updatedOption, updatedValue) => {
    if (name === "subCategory") {
      setSubCategories(updatedOption);
      setSubCategory(updatedValue);
    }
    setOptions({ ...options, [name]: updatedOption });
    setValue({ ...value, [name]: updatedValue });
    return;
  };

  useEffect(() => {
    const loadSubCategories = async () => {
      const { data } = await pickByParentId(value.category._id);
      setSubCategories(data);
      setSubCategory(data[0]);
    };

    if (!value.category || prevSubCategory.current === "") return;
    setSubCategories([]);
    setSubCategory("");
    loadSubCategories();
  }, [value.category, setSubCategory]);

  useEffect(() => {
    prevSubCategory.current = subCategory;
  }, [subCategory]);

  const handleValueChange = (path, newValue) => {
    setValue({ ...value, [path]: newValue });
  };

  const labels = {
    category: "Category",
    subCategory: "Sub category",
    brand: "Brand",
  };

  return Object.keys(options).map((k) => (
    <CustomAutocomplete
      key={k}
      value={k === "subCategory" ? { [k]: subCategory } : value}
      options={k === "subCategory" ? { [k]: subCategories } : options}
      handleValueChange={handleValueChange}
      cleanUpAutocomplete={cleanUpAutocomplete}
      refreshAutocomplete={refreshAutocomplete}
      dependency={k === "subCategory" ? value.category : undefined}
      name={k}
      label={labels[k]}
      error={errors[k]}
    />
  ));
};

export default ProductAttributes;
