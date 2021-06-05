import { Button, Grid } from "@material-ui/core";
import CategoryFilterInput from "../components/CategoryFilterInput";

const TogglingInput = ({
  inputValue,
  setInputValue,
  isCategorySelected,
  handleSubmit,
  handleCancel,
}) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <CategoryFilterInput
          value={inputValue}
          onChange={setInputValue}
          isCategorySelected={isCategorySelected}
        />
      </Grid>
      <Grid container spacing={1}>
        {isCategorySelected && (
          <>
            <Grid item xs={6}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
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
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default TogglingInput;
