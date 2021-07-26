import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  select: {
    minWidth: "2rem",
  },
});

const SelectForm = ({
  labelId,
  inputLabel,
  values,
  name,
  value,
  onChange,
  variant,
  register,
}) => {
  const classes = useStyles();

  return (
    <FormControl variant={variant}>
      <InputLabel id={labelId}>{inputLabel}</InputLabel>
      <Select
        labelId={labelId}
        name={name}
        label={inputLabel}
        classes={{ select: classes.select }}
        {...register}
      >
        {values.map((v, i) => (
          <MenuItem key={`selectFormItem${v.name}`} value={i}>
            {v.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectForm;
