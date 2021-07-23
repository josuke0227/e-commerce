import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Slide from "../components/Slide";
import { filterByAttribute, getProducts } from "../services/productServices";
import ProductFilterMenu from "../components/ProductFilterMenu";
import ProductFilterSubMenu from "../components/ProductFilterSubMenu";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  drawer: {
    height: "auto",
  },
});

export default function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [slide, setSlide] = React.useState(false);
  const [category, setCategory] = React.useState("");

  const { query } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!query.length) {
      loadWholeProducts();
      return;
    }
    loadFilteredProducts(query);
  }, [query]);
  const loadWholeProducts = async () => {
    const { data } = await getProducts();
    setProducts(data);
  };
  const loadFilteredProducts = async () => {
    const { data } = await filterByAttribute(query);
    setProducts(data);
  };

  const handleBackClick = () => {
    setSlide(false);
    dispatch({
      type: "RESET_STATE",
    });
    dispatch({
      type: "CLEAR_QUERY",
    });
  };

  return (
    <div className="">
      <Slide
        slide={slide}
        frameWidth="250px"
        frameHeight="100vh"
        defaultContent={
          <ProductFilterMenu setSlide={setSlide} setCategory={setCategory} />
        }
        alternativeContent={
          <ProductFilterSubMenu
            handleBackClick={handleBackClick}
            category={category}
            products={products}
            setSlide={setSlide}
          />
        }
      />
    </div>
  );
}
