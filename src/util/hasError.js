export const getHelperText = (path, errors) =>
  errors[path] ? errors[path].message : "";
