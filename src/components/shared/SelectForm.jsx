import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

const SelectForm = ({
  labelId,
  inputLabel,
  values,
  name,
  value,
  onChange,
  variant,
}) => {
  return (
    <FormControl variant={variant}>
      <InputLabel id={labelId}>{inputLabel}</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        onChange={onChange}
        name={name}
        label={inputLabel}
      >
        {values.map((v) => (
          <MenuItem key={`selectFormItem${v.name}`} value={v}>
            {v.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectForm;
