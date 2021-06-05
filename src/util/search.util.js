export const getSearchResult = (data, query) =>
  data.filter((d) => {
    const name = d.name.toLowerCase();
    const term = query.toLowerCase();
    return name.includes(term);
  });
