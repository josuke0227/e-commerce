import React from "react";
import { TextField } from "@material-ui/core";
import { useController } from "react-hook-form";
import { getHelperText } from "../../util/getHelperText";

const Input = ({ control, name, defaultValue = "", errors, ...rest }) => {
  const {
    field: { ref, ...inputProps },
  } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue,
  });

  return (
    <TextField
      {...inputProps}
      {...rest}
      inputRef={ref}
      helperText={getHelperText(name, errors)}
      error={!!getHelperText(name, errors)}
    />
  );
};

export default Input;
