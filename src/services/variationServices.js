import axios from "axios";

export const getVariations = async () =>
  await axios({
    method: "get",
    url: `${process.env.REACT_APP_API}/variations/`,
  });
