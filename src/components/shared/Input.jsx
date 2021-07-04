import React from "react";
import { TextField } from "@material-ui/core";
import { useController, useForm } from "react-hook-form";

const Input = ({ control, name, defaultValue, ...rest }) => {
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

  return <TextField {...inputProps} {...rest} inputRef={ref} />;
};

export default Input;
