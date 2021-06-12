import axios from "axios";

export const createProduct = async (productObj, user) =>
  await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API}/products/`,
    data: { ...productObj },
    headers: {
      "x-auth-token": user.token,
    },
  });

export const uploadImage = async (url, productId, user) => {
  return await axios({
    method: "post",
    url: `${process.env.REACT_APP_API}/images/upload`,
    data: { imageUri: url, productId, postedBy: user.id },
    headers: {
      "x-auth-token": user ? user.token : "",
    },
  });
};
