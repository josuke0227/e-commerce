import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  FormControlLabel,
  Checkbox,
  Button,
  InputLabel,
  FormHelperText,
  FormControl,
  Select,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { countries } from "../data-sample/sampleCountries";
// TODO: revert
import { registerAddress } from "../services/userService";
import { getCountryNames } from "../services/countriesService";
import Input from "./shared/Input";
import { getHelperText } from "../util/getHelperText";

const schema = Joi.object({
  address1: Joi.string().min(1).max(255).required(),
  address2: Joi.string().min(1).max(255),
  city: Joi.string().min(1).max(255),
  country: Joi.string().min(1).max(255),
  isDefault: Boolean,
  name: Joi.string().min(1).max(255),
  phone: Joi.string()
    .pattern(/^([0-9])\w+$/)
    .min(1)
    .max(255),
  postcode: Joi.string()
    .pattern(/^([0-9])\w+$/)
    .min(1)
    .max(255),
  state: Joi.string().min(1).max(255),
});

const useStyles = makeStyles((theme) => ({
  form: {
    marginBottom: theme.spacing(2),
  },
}));

export default function AddressForm() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [countriess, setCountries] = useState([]);
  const {
    user,
    address: { selected },
  } = useSelector((state) => ({ ...state }));
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      ...selected,
    },
  });

  // TODO: revert
  // useEffect(() => {
  //   const loadCountries = async () => {
  //     const { data } = await getCountryNames();
  //     setCountries(data);
  //   };

  //   loadCountries();
  // }, [])

  const onSubmit = async (data) => {
    try {
      await registerAddress(data, user);
    } catch (error) {
      console.log(error);
    }
    dispatch({ type: "CLOSE_DIALOG" });
  };

  const textInputDefs = [
    {
      name: "name",
      label: "Full name",
    },
    {
      name: "phone",
      label: "Phone number",
    },
    {
      name: "address1",
      label: "Address line 1",
    },
    {
      name: "address2",
      label: "Address line 2",
    },
    {
      name: "postcode",
      label: "Postcode",
    },
    {
      name: "city",
      label: "City",
    },
    {
      name: "state",
      label: "State/Territory",
    },
  ];

  if (!selected && selected !== undefined)
    return <div className="">loading</div>;
  return (
    <form
      style={{ display: "flex", flexDirection: "column" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      {countries.length > 0 ? (
        <FormControl variant="outlined" className={classes.form}>
          <InputLabel htmlFor="country-select">Country</InputLabel>
          <Controller
            name="country"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                native
                label="Country"
                {...field}
                inputProps={{
                  name: "country",
                }}
              >
                <option aria-label="None" value="" />
                {countries.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            )}
          />
          <FormHelperText error>
            {errors.country ? errors.country.message : ""}
          </FormHelperText>
        </FormControl>
      ) : (
        <div className="">Loading...</div>
      )}
      {textInputDefs.map((d) => (
        <Input
          key={d.name}
          className={classes.form}
          errors={errors}
          type="text"
          name={d.name}
          control={control}
          variant="outlined"
          label={d.label}
          required
          fullWidth
        />
      ))}
      <FormControlLabel
        className={classes.form}
        control={
          <Controller
            name="isDefault"
            control={control}
            defaultValue={false}
            rules={{ required: true }}
            render={({ field }) => <Checkbox {...field} />}
          />
        }
        label="Use as my default address"
      />
      <Button color="primary" variant="contained" type="submit">
        Save Changes
      </Button>
    </form>
  );
}
