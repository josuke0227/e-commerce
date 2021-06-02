import axios from "axios";

export const currentAdmin = async (token) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/currentadmin`,
    {},
    {
      headers: {
        "x-auth-token": token,
      },
    }
  );
};
