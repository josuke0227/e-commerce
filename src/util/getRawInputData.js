export const getRawInputData = (data) => {
  const rawInputData = new DOMParser().parseFromString(data, "text/html")
    .documentElement.textContent;

  return rawInputData.replace("\n", "");
};
