import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Slide from "../components/Slide";
import ProductFilterMenu from "../components/ProductFilterMenu";
import ProductFilterSubMenu from "../components/ProductFilterSubMenu";

export default function TemporaryDrawer() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => ({ ...state }));
  const [slide, setSlide] = React.useState(false);
  const [category, setCategory] = React.useState("");

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
