import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          margin: 0,
        },
      },
    },
  },
  formTitle: {
    marginBottom: "1rem",
  },
  inputForm: {
    width: "100%",
    marginBottom: "1rem",
  },
  formButton: {
    textTransform: "uppercase",
    marginBottom: "1rem",
  },
  formAlert: {
    marginBottom: "1rem",
  },
  formSubtitle: {
    marginBottom: "1rem",
    textAlign: "center",
  },
  headerItem: {
    marginRight: "0.3rem",
  },
  menuText: {
    margin: 0,
    textTransform: "Capitalize",
  },
  menuLink: {
    textDecoration: "none",
    color: "#fff",
  },
});

theme.mixins.toolbar = {
  ...theme.mixins.toolbar,
  minHeight: 91,
  [theme.breakpoints.up("sm")]: {
    minHeight: 64,
  },
};
