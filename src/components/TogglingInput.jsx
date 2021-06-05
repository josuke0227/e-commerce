import { Button, Grid, makeStyles } from "@material-ui/core";
import CategoryFilterInput from "../components/CategoryFilterInput";
import ButtonWithLoader from "./shared/ButtonWIthLoader";

const useStyle = makeStyles({
  container: {
    marginTop: "1rem",
    paddingTop: (isCategorySelected) => (!isCategorySelected ? "1rem" : "0"),
  },
  buttons: {
    visibility: (isCategorySelected) =>
      isCategorySelected ? "visible" : "hidden",
  },
});

const TogglingInput = ({
  inputValue,
  setInputValue,
  isCategorySelected,
  handleSubmit,
  handleCancel,
  isSubmitting,
}) => {
  const classes = useStyle(isCategorySelected);

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <CategoryFilterInput
          value={inputValue}
          onChange={setInputValue}
          isCategorySelected={isCategorySelected}
        />
      </Grid>
      <Grid className={classes.buttons} container spacing={1}>
        <Grid item xs={6}>
          <ButtonWithLoader
            label="Submit"
            handleSubmit={handleSubmit}
            loading={isSubmitting}
            loaderSize={25}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="default"
            onClick={handleCancel}
            fullWidth
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TogglingInput;
