const AddressCard = ({ address }) => {
  const { name, address1, address2, city, state, postcode, country } = address;

  return (
    <section>
      <div className="">
        <span>{name}</span>
      </div>
      <div className="">
        <span>{address1} </span>
        <span>{address2}</span>
      </div>
      <div className="">
        <span>{city}, </span>
        <span>{state}, </span>
        <span>{postcode}</span>
      </div>
      <div className="">
        <span>{country}</span>
      </div>
    </section>
  );
};

export default AddressCard;
