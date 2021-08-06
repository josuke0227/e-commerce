import axios from "axios";

export const registerAddress = async (address, user) =>
  await axios({
    method: "put",
    data: [address],
    url: `${process.env.REACT_APP_API}/user/address/register/${user.id}`,
    headers: {
      "x-auth-token": user.token,
    },
  });

export const updateAddress = async (address, user) =>
  await axios({
    method: "put",
    data: [address],
    url: `${process.env.REACT_APP_API}/user/address/update/${user.id}`,
    headers: {
      "x-auth-token": user.token,
    },
  });

export const changeDefaultAddress = async (address, user) =>
  await axios({
    method: "put",
    data: address,
    url: `${process.env.REACT_APP_API}/user/address/changedefault/${user.id}`,
    headers: {
      "x-auth-token": user.token,
    },
  });

export const getAddress = async (user) =>
  await axios({
    method: "get",
    url: `${process.env.REACT_APP_API}/user/address/${user.id}`,
    headers: {
      "x-auth-token": user.token,
    },
  });
