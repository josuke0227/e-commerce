import axios from "axios";

export const signin = async (data) =>
  await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API}/signin`,
    data,
  });
