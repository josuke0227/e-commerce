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
}) => {
  const classes = useStyles();

  return (
    <FormControl variant={variant}>
      <InputLabel id={labelId}>{inputLabel}</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        onChange={onChange}
        name={name}
        label={inputLabel}
        classes={{ select: classes.select }}
      >
        {values.map((v, i) => (
          <MenuItem key={`selectFormItem${v.name}`} value={i}>
            {v.name}
          </MenuItem>
        ))}
        {/* {values.map((v) => (
          <MenuItem key={`selectFormItem${v.name}`} value={v}>
            {v.name}
          </MenuItem>
        ))} */}
      </Select>
    </FormControl>
  );
};

export default SelectForm;
