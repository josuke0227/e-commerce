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
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryServices";
import {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../../services/subCategoryServices";
import { useSelector } from "react-redux";
import Grow from "@material-ui/core/Grow";
import Joi from "joi";
import { getIndex } from "../../util/getIndex";

const INITIAL_RESULT_STATE = { success: null, message: "" };

const INITIAL_BUTTON_STATE = { add: false, edit: false, delete: false };

const rawInputSchema = Joi.string().min(1).max(255).label("Category");

const serviceMap = {
  category: {
    add: createCategory,
    edit: updateCategory,
    delete: deleteCategory,
  },
  subCategory: {
    add: createSubCategory,
    edit: updateSubCategory,
    delete: deleteSubCategory,
  },
  brand: {
    add: "",
    edit: "",
    delete: "",
  },
};

const MultiPurposeAutoCompleteForm = ({
  options,
  setOptions,
  value,
  setValue,
  label,
  error,
  name,
  dependency,
}) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(INITIAL_RESULT_STATE);
  const [loading, setLoading] = useState(false);
  const [buttonState, setButtonState] = useState(INITIAL_BUTTON_STATE);
  const [enabledAction, setEnabledAction] = useState("");

  useEffect(() => {
    if (options === null) {
      setInputValue("");
      return setButtonState({ ...INITIAL_BUTTON_STATE, add: true });
    }

    if (!options.length) return;
    const initialValue = value ? value : options[0];
    setValue(initialValue);
  }, [options]);

  const handleAddClick = async () => {
    const { error } = rawInputSchema.validate(inputValue);
    if (error)
      return setResult({ success: false, message: error.details[0].message });

    setResult(INITIAL_RESULT_STATE);
    setLoading(true);
    try {
      const httpService = serviceMap[name].add;
      const { data } = await httpService(inputValue, user);
      const currentCategories = updateUiFuncMap.add(data);
      setResult({ success: true, message: "Success!" });
      setOptions(currentCategories);
      enabledAction !== "delete" && setValue(data);
    } catch (error) {
      console.log(error);
      const message = error.response
        ? error.response.data
        : "Category create failed.";
      setResult({ success: false, message });
    }
    setLoading(false);
  };

  const handleClick = async () => {
    const { error } = rawInputSchema.validate(inputValue);
    if (error)
      return setResult({ success: false, message: error.details[0].message });

    setResult(INITIAL_RESULT_STATE);
    setLoading(true);
    try {
      const { data } = await makeAPICall();
      const currentCategories = updateUiFuncMap[enabledAction](data);
      setResult({ success: true, message: "Success!" });
      console.log(currentCategories);
      setOptions(currentCategories);
      enabledAction !== "delete" && setValue(data);
    } catch (error) {
      console.log(error);
      const message = error.response
        ? error.response.data
        : "Category create failed.";
      setResult({ success: false, message });
    }
    setLoading(false);
  };

  const makeAPICall = async () => {
    const httpService = serviceMap[name][enabledAction];
    if (name === "category") {
      return enabledAction === "add"
        ? await httpService(inputValue, user)
        : await httpService({ ...value, name: inputValue }, user);
    } else if (name === "subCategory") {
      const data =
        enabledAction === "add"
          ? {
              name: inputValue,
              parent: dependency._id,
            }
          : {
              name: inputValue,
              parent: dependency._id,
              slug: value.slug,
            };
      return enabledAction === "add"
        ? await httpService(data, user)
        : await httpService(data, user);
    }
  };

  const updateUiFuncMap = {
    add: (data) => {
      const current = options ? [...options] : [];
      current.push(data);
      return current;
    },
    edit: (data) => {
      const current = [...options];
      current[getIndex(current, value)] = { ...data };
      return current;
    },
    delete: () => {
      const current = options.length > 1 ? [...options] : null;
      current && current.splice(getIndex(current, value), 1);
      return current;
    },
  };

  return (
    <div className="" style={{ marginBottom: "1rem" }}>
      <ActionSelector
        options={options}
        state={buttonState}
        setState={setButtonState}
      />
      <FormControl>
        <div style={{ display: "flex" }}>
          <AutoCompleteForm
            value={value}
            setValue={setValue}
            inputValue={inputValue}
            setInputValue={setInputValue}
            options={options}
            label={label}
            handleAddClick={handleAddClick}
          />
          <ActionButton
            buttonState={buttonState}
            loading={loading}
            handleClick={handleClick}
            enabledAction={enabledAction}
            setEnabledAction={setEnabledAction}
          />
        </div>
        <FormHelperText error={!result.success}>
          {result.message || error}
        </FormHelperText>
      </FormControl>
    </div>
  );
};

const ActionSelector = ({ state, setState, options }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = ({ target }) => {
    const path = target.name;
    setState({ ...INITIAL_BUTTON_STATE, [path]: !state[path] });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  console.log(options);

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
                checked={state.add}
                onChange={handleChange}
                name="add"
                color="primary"
              />
            }
            label="Add new category"
          />
          {options && (
            <>
              <FormControlLabel
                style={{ display: "block" }}
                control={
                  <Switch
                    checked={state.edit}
                    onChange={handleChange}
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
                    checked={state.delete}
                    onChange={handleChange}
                    name="delete"
                    color="primary"
                  />
                }
                label="Delete category"
              />
            </>
          )}
        </div>
      </Popover>
    </>
  );
};

const ActionButton = ({
  buttonState,
  loading,
  handleClick,
  enabledAction,
  setEnabledAction,
}) => {
  useEffect(() => {
    if (!buttonState) return;
    const keys = Object.keys(buttonState);

    let action;
    keys.forEach((k) => {
      if (buttonState[k] === true) action = k;
    });
    if (action === undefined) return setEnabledAction("");
    setEnabledAction(action);
  }, [buttonState]);

  const renderButton = (label) => {
    return (
      <Grow in={enabledAction === label}>
        <Button
          disabled={loading}
          variant="outlined"
          color="primary"
          onClick={handleClick}
        >
          {label}
        </Button>
      </Grow>
    );
  };
  return enabledAction && renderButton(enabledAction);
};

const AutoCompleteForm = ({
  value,
  setValue,
  inputValue,
  setInputValue,
  options,
  label,
}) => {
  if (options === null)
    return (
      <FormControl>
        <TextField
          label={`Add ${label}`}
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </FormControl>
    );
  return (
    <FormControl>
      {value !== undefined && options.length > 0 && (
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
      )}
    </FormControl>
  );
};

export default MultiPurposeAutoCompleteForm;
