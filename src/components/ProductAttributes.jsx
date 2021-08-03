import { useState, useEffect } from "react";
import CustomAutocomplete from "./shared/CustomAutocomplete";
import { getCategories } from "../services/categoryServices";
import { getBrands } from "../services/brandsService";
import { pickByParentId } from "../services/subCategoryServices";

const ProductAttributes = ({ product, value, setValue, errors }) => {
  const [options, setOptions] = useState({
    category: [],
    subCategory: [],
    brand: [],
  });
  // Prevent side effect of reloading subcategory at initial rendering.
  const [prevSubCategory, setPrevSubCategory] = useState();

  useEffect(() => {
    const loadOptions = async (product) => {
      const { data: category } = await getCategories();
      const { data: subCategory } = await pickByParentId(
        product ? product.category._id : category[0]._id
      );
      const { data: brand } = await getBrands();
      setValue({
        category: product ? product.category : category[0],
        subCategory: product ? product.subCategory : subCategory[0],
        brand: product ? product.brand : brand[0],
      });
      setOptions({
        category,
        subCategory,
        brand,
      });
    };
    if (!product) {
      loadOptions();
      return;
    }
    loadOptions(product);
  }, [product]);

  useEffect(() => {
    if (!value.category) {
      setPrevSubCategory(value.subCategory);
      return;
    }
    const reloadSubCategories = async () => {
      cleanUpAutocomplete("subCategory");
      const { data } = await pickByParentId(value.category._id);
      refreshAutocomplete("subCategory", data, data[0]);
    };

    if (prevSubCategory === "") {
      setPrevSubCategory(value.subCategory);
      return;
    }
    reloadSubCategories();
  }, [value.category]);

  const handleValueChange = (path, newValue) => {
    setValue({ ...value, [path]: newValue });
  };

  // Prevent Autocomplete from throwing warning.
  const cleanUpAutocomplete = (label) => {
    setOptions({ ...options, [label]: [] });
    setValue({ ...value, [label]: "" });
    return;
  };

  const refreshAutocomplete = (label, updatedOption, updatedValue) => {
    setOptions({ ...options, [label]: updatedOption });
    setValue({ ...value, [label]: updatedValue });
    return;
  };

  const labels = {
    category: "Category",
    subCategory: "Sub category",
    brand: "Brand",
  };

  return Object.keys(options).map((k) => (
    <CustomAutocomplete
      key={k}
      value={value}
      options={options}
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
