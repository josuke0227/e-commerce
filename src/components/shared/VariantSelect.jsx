import { useController } from "react-hook-form";
import { TextField, MenuItem } from "@material-ui/core";

const Select = ({ control, name, defaultValue, list, ...rest }) => {
  const {
    field: { ref, ...inputProps },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue,
  });

  return (
    <TextField {...inputProps} {...rest} inputRef={ref} select>
      {list.map((l, i) => (
        <MenuItem key={l.name} value={i} name={l.name}>
          {l.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default Select;
