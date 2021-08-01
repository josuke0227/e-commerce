import axios from "axios";

export const updateUser = async (address, user) =>
  await axios({
    method: "put",
    data: { address },
    url: `${process.env.REACT_APP_API}/user/${user._id}`,
  });
