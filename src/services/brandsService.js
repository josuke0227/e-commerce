import axios from "axios";

const baseUrl = `${process.env.REACT_APP_API}/brands`;

export const getBrands = async (user) =>
  await axios({
    method: "GET",
    url: baseUrl,
  });

export const updateBrand = async (category, user) =>
  axios({
    method: "PUT",
    url: `${baseUrl}/${category.slug}`,
    data: { name: category.name },
    headers: {
      "x-auth-token": user.token,
    },
  });

export const createBrand = async (categoryName, user) =>
  axios({
    method: "POST",
    url: `${baseUrl}/`,
    data: { name: categoryName },
    headers: {
      "x-auth-token": user.token,
    },
  });

export const deleteBrand = async (category, user) =>
  axios({
    method: "DELETE",
    url: `${baseUrl}/${category.slug}`,
    headers: {
      "x-auth-token": user.token,
    },
  });
