import axios from "axios";

export const getVariants = async () =>
  await axios({
    method: "get",
    url: `${process.env.REACT_APP_API}/variations/`,
  });
