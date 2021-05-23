import axios from "axios";

export const signin = async (data) =>
  await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API}/signin`,
    data,
  });

export const signinWithGoogle = async (response) =>
  axios({
    method: "POST",
    url: `${process.env.REACT_APP_API}/signin/googleaccount`,
    data: { idToken: response.tokenId },
  });

export const signinWithFacebook = async (response) =>
  axios({
    method: "POST",
    url: `${process.env.REACT_APP_API}/signin/facebookaccount`,
    data: { userID: response.userID, accessToken: response.accessToken },
  });
