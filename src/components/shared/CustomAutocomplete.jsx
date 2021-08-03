import { useState } from "react";
import { useSelector } from "react-redux";
import {
  FormControl,
  FormHelperText,
  makeStyles,
  TextField,
} from "@material-ui/core";
import Autocomplete from "./Autocomplete";
import AutocompleteMenu from "../AutocompleteMenu";
import AutocompleteActionButtons from "../AutocompleteActionButtons";
import Joi from "joi";
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
import {
  createBrand,
  updateBrand,
  deleteBrand,
} from "../../services/brandsService";
import { getIndex } from "../../util/getIndex";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing(2),
  },
  formContainer: {
    display: "flex",
    gap: theme.spacing(1),
  },
}));

const INITIAL_RESULT_STATE = { success: null, message: "" };

const INITIAL_BUTTON_STATE = {
  add: false,
  edit: false,
  delete: false,
};

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
    add: createBrand,
    edit: updateBrand,
    delete: deleteBrand,
  },
};

const CustomAutoComplete = ({
  value: wholeValue,
  options: wholeOptions,
  handleValueChange,
  name,
  label,
  dependency,
  error,
  cleanUpAutocomplete,
  refreshAutocomplete,
}) => {
  const options = wholeOptions[name];
  const value = wholeValue[name];

  const classes = useStyles();
  const { user } = useSelector((state) => ({ ...state }));
  const [buttonState, setButtonState] = useState(INITIAL_BUTTON_STATE);
  const [result, setResult] = useState(INITIAL_RESULT_STATE);
  const [action, setAction] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  // When editing, value changes to null. Keep the truck of chosen value.
  const [currentValue, setCurrentValue] = useState("");

  const handleListItemClick = (path) => {
    if (path === "edit") setCurrentValue(value);
    setButtonState({ ...INITIAL_BUTTON_STATE, [path]: true });
  };

  const handleCancelButtonClick = () => {
    setButtonState(INITIAL_BUTTON_STATE);
  };

  const handleActionButtonClick = async () => {
    const { error } = rawInputSchema.validate(inputValue);
    if (error)
      return setResult({ success: false, message: error.details[0].message });

    setResult(INITIAL_RESULT_STATE);
    setLoading(true);
    try {
      const { data } = await makeAPICall();
      const updatedOptions = updateUiFuncMap[action](data);
      setResult({ success: true, message: "Success!" });
      cleanUpAutocomplete(name);
      if (action === "delete") {
        refreshAutocomplete(name, updatedOptions, updatedOptions[0]);
        exitingFunction();
        return;
      }
      refreshAutocomplete(name, updatedOptions, data);
    } catch (error) {
      console.log(error);
      const message = error.response
        ? error.response.data
        : "Category create failed.";
      setResult({ success: false, message });
    }
    exitingFunction();
  };

  const exitingFunction = () => {
    setButtonState(INITIAL_BUTTON_STATE);
    setLoading(false);
  };

  const makeAPICall = async () => {
    const httpService = serviceMap[name][action];

    if (name === "subCategory") {
      const data =
        action === "add"
          ? {
              name: inputValue,
              parent: dependency._id,
            }
          : {
              name: inputValue,
              parent: dependency._id,
              slug: value.slug,
            };
      return action === "add"
        ? await httpService(data, user)
        : await httpService(data, user);
    } else {
      return action === "add"
        ? await httpService(inputValue, user)
        : await httpService({ ...currentValue, name: inputValue }, user);
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
      current[getIndex(current, currentValue)] = { ...data };
      return current;
    },
    delete: () => {
      const current = options.length > 1 ? [...options] : null;
      current && current.splice(getIndex(current, value), 1);
      return current;
    },
  };

  const isReady = () => (options.length && value === null) || value;

  const isEmpty = () => !options.length && value === undefined;

  if (isEmpty())
    return (
      <div className={classes.formContainer}>
        <TextField
          variant="filled"
          label={`Add ${label}`}
          value={inputValue}
          helperText={result.message || error}
          error={result.success === false}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <AutocompleteActionButtons
          add
          loading={loading}
          buttonState={buttonState}
          action={action}
          setAction={setAction}
          handleCancelButtonClick={handleCancelButtonClick}
          handleActionButtonClick={handleActionButtonClick}
          setInputValue={setInputValue}
        />
      </div>
    );

  return isReady() ? (
    <div className={classes.container}>
      <AutocompleteMenu
        buttonState={buttonState}
        label={label}
        options={options}
        handleListItemClick={handleListItemClick}
      />
      <FormControl>
        <div className={classes.formContainer}>
          <Autocomplete
            name={name}
            label={label}
            options={options}
            onOptionChange={handleValueChange}
            onInputChange={setInputValue}
            inputValue={inputValue}
            value={value}
          />
          <AutocompleteActionButtons
            loading={loading}
            buttonState={buttonState}
            action={action}
            setAction={setAction}
            handleCancelButtonClick={handleCancelButtonClick}
            handleActionButtonClick={handleActionButtonClick}
          />
        </div>
        <FormHelperText error={result.success === false || !!error}>
          {result.message || error}
        </FormHelperText>
      </FormControl>
    </div>
  ) : (
    <div className="">Loading...</div>
  );
};

export default CustomAutoComplete;
