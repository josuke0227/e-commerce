import React from "react";
import { TextField } from "@material-ui/core";
import { useController } from "react-hook-form";

const Input = ({ control, name, defaultValue, ...rest }) => {
  const {
    field: { ref, ...inputProps },
  } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue,
  });

  return <TextField {...inputProps} {...rest} inputRef={ref} />;
};

export default Input;
