import Layout from "../components/Layout";
import ProductRegistrationForm from "../components/ProductRegistrationForm";

const CreateProductPage = ({ location }) => {
  return (
    <Layout location={location}>
      <ProductRegistrationForm />
    </Layout>
  );
};

export default CreateProductPage;
