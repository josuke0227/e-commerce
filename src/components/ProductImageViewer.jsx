import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ProductImageViewer = ({ images }) => {
  return (
    <Carousel showArrows={true} autoPlay infiniteLoop>
      {images.map((i) => (
        <img
          key={i.public_id}
          src={i.url}
          style={{ width: "100%" }}
          alt="description"
        />
      ))}
    </Carousel>
  );
};

export default ProductImageViewer;
