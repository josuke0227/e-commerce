import { makeStyles } from "@material-ui/core";
import { useController } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  Select as MaterialUISelect,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  label: {
    textTransform: "capitalize",
  },
}));

const Select = ({ control, name, defaultValue, children, ...rest }) => {
  const classes = useStyles();
  const {
    field: { ref, ...inputProps },
  } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue,
  });

  return (
    <FormControl className={classes.formControl}>
      <InputLabel classes={{ root: classes.label }} id={`${name}-label`}>
        {name}
      </InputLabel>
      <MaterialUISelect
        labelId={`${name}-label`}
        id={name}
        {...inputProps}
        {...rest}
        inputRef={ref}
      >
        {children}
      </MaterialUISelect>
    </FormControl>
  );
};

export default Select;
