import { useState } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete as MuiAutocomplete } from "@material-ui/lab";

const Autocomplete = ({
  options = [],
  value,
  onOptionChange,
  name,
  label,
  inputValue,
  onInputChange,
}) => {
  return (
    <MuiAutocomplete
      clearOnBlur={false}
      value={value}
      onChange={(event, newValue) => {
        onOptionChange(name, newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        onInputChange(newInputValue);
      }}
      id={name}
      options={options}
      getOptionSelected={(option, value) =>
        JSON.stringify(option) === JSON.stringify(value)
      }
      getOptionLabel={(option) => option.name}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
    />
  );
};

export default Autocomplete;
