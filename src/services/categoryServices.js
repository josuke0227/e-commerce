import axios from "axios";

export const getCategories = async (user) =>
  await axios({
    method: "GET",
    url: `${process.env.REACT_APP_API}/categories`,
  });

export const updateCategory = async (category, user) =>
  axios({
    method: "PUT",
    url: `${process.env.REACT_APP_API}/categories/${category.slug}`,
    data: { name: category.name },
    headers: {
      "x-auth-token": user.token,
    },
  });

export const createCategory = async (categoryName, user) =>
  axios({
    method: "POST",
    url: `${process.env.REACT_APP_API}/categories/`,
    data: { name: categoryName },
    headers: {
      "x-auth-token": user.token,
    },
  });

export const deleteCategory = async (category, user) =>
  axios({
    method: "DELETE",
    url: `${process.env.REACT_APP_API}/categories/${category.slug}`,
    headers: {
      "x-auth-token": user.token,
    },
  });
