import Layout from "../components/Layout";
import CreateProductForm from "../components/CreateProductForm";

const CreateProductPage = ({ location }) => {
  return (
    <Layout location={location}>
      <CreateProductForm />
    </Layout>
  );
};

export default CreateProductPage;
