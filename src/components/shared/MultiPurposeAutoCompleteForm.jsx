import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import FormHelperText from "@material-ui/core/FormHelperText";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Popover from "@material-ui/core/Popover";
import Switch from "@material-ui/core/Switch";
import { createCategory } from "../../services/categoryServices";
import { useSelector } from "react-redux";
import Joi from "joi";

const INITIAL_RESULT_STATE = { success: null, message: "" };

const rawInputSchema = Joi.string().min(1).max(255).label("Category name");

const MultiPurposeAutoCompleteForm = ({
  options,
  value,
  setValue,
  label,
  error,
}) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(INITIAL_RESULT_STATE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!options.length) return;
    const initialValue = value ? value : options[0];
    setValue(initialValue);
  }, [options]);

  const handleClick = async () => {
    const { error } = rawInputSchema.validate(inputValue);
    if (error)
      return setResult({ success: false, message: error.details[0].message });

    setResult(INITIAL_RESULT_STATE);
    setLoading(true);
    try {
      const { data } = await createCategory(inputValue, user);
      const currentCategories = [...options];
      currentCategories.push(data);
      setResult({ success: true, message: "Success!" });
      setValue(currentCategories);
    } catch (error) {
      const message = error.response.data || "Category create failed.";
      setResult({ success: false, message });
    }
    setLoading(false);
  };

  return (
    <div className="" style={{ margin: "1rem" }}>
      {/* Show button next to AutoComplete */}
      {/* Apply onClick event which makes API call dynamically */}
      <Options />
      <AutoCompleteForm
        value={value}
        setValue={setValue}
        inputValue={inputValue}
        setInputValue={setInputValue}
        options={options}
        loading={loading}
        handleClick={handleClick}
        result={result}
        label={label}
        error={error}
      />
    </div>
  );
};

const Options = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <IconButton color="default" onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div style={{ margin: "0.5rem" }}>
          <FormControlLabel
            style={{ display: "block" }}
            control={
              <Switch
                // checked={state.checkedB}
                // onChange={handleChange}
                name="add"
                color="primary"
              />
            }
            label="Add new category"
          />
          <FormControlLabel
            style={{ display: "block" }}
            control={
              <Switch
                // checked={state.checkedB}
                // onChange={handleChange}
                name="edit"
                color="primary"
              />
            }
            label="Edit category"
          />
          <FormControlLabel
            style={{ display: "block" }}
            control={
              <Switch
                // checked={state.checkedB}
                // onChange={handleChange}
                name="delete"
                color="primary"
              />
            }
            label="Delete category"
          />
        </div>
      </Popover>
    </>
  );
};

const AutoCompleteForm = ({
  value,
  setValue,
  inputValue,
  setInputValue,
  options,
  loading,
  handleClick,
  result,
  label,
  error,
}) => {
  return (
    <FormControl>
      {value !== undefined && (
        <>
          <div style={{ display: "flex" }}>
            <Autocomplete
              clearOnBlur={false}
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
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
            <Button
              disabled={loading}
              variant="outlined"
              color="primary"
              onClick={handleClick}
            >
              Add
            </Button>
          </div>
          <FormHelperText error={!result.success}>
            {result.message || error}
          </FormHelperText>
        </>
      )}
    </FormControl>
  );
};

export default MultiPurposeAutoCompleteForm;
