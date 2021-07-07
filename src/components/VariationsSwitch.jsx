import {
  FormControl,
  FormControlLabel,
  Switch,
  FormHelperText,
} from "@material-ui/core";

const VariationsSwitch = ({ enableVariations, handleSwitch, error }) => {
  return (
    <FormControl component="fieldset">
      <FormControlLabel
        label="Enable variations"
        control={
          <Switch
            checked={enableVariations}
            onChange={handleSwitch}
            color="primary"
          />
        }
      />
      <FormHelperText error>{error}</FormHelperText>
    </FormControl>
  );
};

export default VariationsSwitch;
