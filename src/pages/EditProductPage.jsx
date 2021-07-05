import Layout from "../components/Layout";
import ProductEditForm from "../components/ProductEditForm";

const EditProductPage = ({ location }) => {
  return (
    <Layout location={location}>
      <ProductEditForm />
    </Layout>
  );
};

export default EditProductPage;
