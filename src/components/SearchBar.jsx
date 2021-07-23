import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, fade } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  search: {
    gridArea: "search",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginBottom: theme.spacing(1),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
      flex: 1,
    },
    [theme.breakpoints.up("md")]: {
      marginRight: theme.spacing(2),
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    padding: theme.spacing(1),
  },
  startIcon: {
    paddingLeft: theme.spacing(1),
  },
  endIcon: {
    paddingRight: theme.spacing(1),
  },
}));

const SearchBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!searchTerm) return;
    const delayed = setTimeout(() => {
      dispatch({
        type: "SET_QUERY",
        payload: { name: "text", data: [{ value: searchTerm }] },
      });
    }, 1500);
    return () => {
      clearTimeout(delayed);
    };
  }, [searchTerm]);

  const handleChange = (e) => setSearchTerm(e.target.value);

  const handleCancelIconClick = () => {
    setSearchTerm("");
    dispatch({
      type: "RESET_QUERY",
      payload: { name: "text" },
    });
  };

  const renderCancelIcon = () =>
    searchTerm && (
      <CancelIcon className={classes.endIcon} onClick={handleCancelIconClick} />
    );

  return (
    <InputBase
      className={classes.search}
      placeholder="Search…"
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
      inputProps={{ "aria-label": "search" }}
      onChange={handleChange}
      value={searchTerm}
      endAdornment={renderCancelIcon()}
      startAdornment={<SearchIcon className={classes.startIcon} />}
    />
  );
};

export default SearchBar;
