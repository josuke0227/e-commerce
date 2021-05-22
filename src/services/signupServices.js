import axios from "axios";

export const sendUserEmail = async (email) =>
  await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API}/signup`,
    data: { email },
  });

export const signupWithGoogle = async (response) =>
  axios({
    method: "POST",
    url: `${process.env.REACT_APP_API}/signup/googleaccount`,
    data: { idToken: response.tokenId }, // key name is set the same as the prop of token parser on backend
  });
