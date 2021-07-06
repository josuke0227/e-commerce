import {
  FormControl,
  FormControlLabel,
  Switch,
  FormHelperText,
} from "@material-ui/core";

const VariationsSwitch = ({ enableVariations, handleSwitch, errors }) => {
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
      <FormHelperText error>{errors}</FormHelperText>
    </FormControl>
  );
};

export default VariationsSwitch;
