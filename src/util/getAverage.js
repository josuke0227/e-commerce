export const getAverage = (ratings) =>
  ratings.map((r) => r.rate).reduce((acc, next) => acc + next, 0) /
  ratings.length;
