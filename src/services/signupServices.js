import axios from "axios";

export const sendUserEmail = async (email) =>
  await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API}/signup`,
    data: { email },
  });
