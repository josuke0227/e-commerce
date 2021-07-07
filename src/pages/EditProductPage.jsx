import Layout from "../components/Layout";
import EditProductForm from "../components/EditProductForm";

const EditProductPage = ({ location }) => {
  return (
    <Layout location={location}>
      <EditProductForm />
    </Layout>
  );
};

export default EditProductPage;
