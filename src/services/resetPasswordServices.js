import axios from "axios";

export const resetPassword = async (data) =>
  await axios({
    method: "PUT",
    url: `${process.env.REACT_APP_API}/resetpassword`,
    data,
  });
