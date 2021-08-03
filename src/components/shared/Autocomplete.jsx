import { useState } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete as MuiAutocomplete } from "@material-ui/lab";

const Autocomplete = ({
  options = [],
  value,
  onOptionChange,
  label,
  inputValue,
  onInputChange,
}) => {
  const isEmpty = () => !options.length && value === undefined;

  if (isEmpty()) return <div className="">No {label} are registered.</div>;

  return (
    <MuiAutocomplete
      clearOnBlur={false}
      value={value}
      onChange={(event, newValue) => {
        onOptionChange(label, newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        onInputChange(newInputValue);
      }}
      id={label}
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
