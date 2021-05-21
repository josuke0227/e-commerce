import axios from "axios";

export const createUser = async (data) =>
  await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API}/accountactivation`,
    data,
  });
