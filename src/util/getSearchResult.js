export const getSearchResult = (data, query) => {
  return (
    data.length > 0 &&
    data.filter((d) => {
      const name = d.name.toLowerCase();
      const term = query.toLowerCase();
      return name.includes(term);
    })
  );
};
