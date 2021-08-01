import axios from "axios";

export const getCountryNames = async () =>
  await axios({
    method: "get",
    url: "https://restcountries.eu/rest/v2/all",
  });
