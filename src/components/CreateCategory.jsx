import CategoryCreateForm from "../components/CategoryCreateForm";

const CreateSection = ({ doCategoryCreate, loading }) => {
  return (
    <section className="">
      <CategoryCreateForm
        doCategoryCreate={doCategoryCreate}
        loading={loading}
      />
    </section>
  );
};

export default CreateSection;
