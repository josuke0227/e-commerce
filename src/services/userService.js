import axios from "axios";

export const updateUser = async (address, user) =>
  await axios({
    method: "put",
    data: address,
    url: `${process.env.REACT_APP_API}/user/${user.id}`,
    headers: {
      "x-auth-token": user.token,
    },
  });

export const getAddress = async (user) =>
  await axios({
    method: "get",
    url: `${process.env.REACT_APP_API}/user/${user.id}`,
    headers: {
      "x-auth-token": user.token,
    },
  });
