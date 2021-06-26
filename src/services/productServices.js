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

export const uploadImage = async (url, productId, user) =>
  await axios({
    method: "post",
    url: `${process.env.REACT_APP_API}/images/upload`,
    data: { imageUri: url, productId, postedBy: user.id },
    headers: {
      "x-auth-token": user ? user.token : "",
    },
  });

export const deleteImage = async (public_id, user) =>
  await axios({
    method: "delete",
    url: `${process.env.REACT_APP_API}/images/${public_id}`,
    headers: {
      "x-auth-token": user ? user.token : "",
    },
  });

export const getImages = async (productId, user) =>
  await axios({
    method: "get",
    url: `${process.env.REACT_APP_API}/images/${productId}`,
    headers: {
      "x-auth-token": user.token,
    },
  });

export const getProducts = async (sort, order, page) =>
  await axios.get(`${process.env.REACT_APP_API}/products`, {
    sort,
    order,
    page,
  });

export const getProductsByCount = async (count, user, slug) =>
  await axios.get(`${process.env.REACT_APP_API}/products/${slug}`, {
    headers: {
      "x-auth-token": user.token,
    },
  });

export const getProduct = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/products/${slug}`);

export const getCount = async () =>
  await axios.get(`${process.env.REACT_APP_API}/products/total`);

export const updateProduct = async (product, user) =>
  await axios.put(
    `${process.env.REACT_APP_API}/products/${product.slug}`,
    product,
    {
      headers: {
        "x-auth-token": user.token,
      },
    }
  );

export const deleteProduct = async (product, user) => {
  const { _id, slug } = product;
  return await axios.delete(`${process.env.REACT_APP_API}/products/${slug}`, {
    data: { id: _id },
    headers: {
      "x-auth-token": user.token,
    },
  });
};
