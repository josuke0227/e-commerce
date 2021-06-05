import { CircularProgress } from "@material-ui/core";

const SmallLoader = ({ loaderSize = 20 }) => (
  <CircularProgress color="inherit" size={loaderSize} />
);

export default SmallLoader;
