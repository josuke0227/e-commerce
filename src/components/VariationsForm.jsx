import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";

/**
 * input: array
 * variants = [
    {
      type: "color",
      variations: ["Red", "Blue", "Green", "Yellow"],
    },
    { type: "size", variations: ["S", "M", "L"] },
  ];

 * output: array
 * variations = [
  { color: "Red", qty: "1", size: "S" },
  { color: "Red", qty: "3", size: "L" },
  { color: "Blue", qty: "1", size: "S" },
  { color: "Blue", qty: "2", size: "M" },
]
 */

const initialState = {
  // initialize this object with useEffect
  color: "",
  size: "",
  qty: "",
  instances: [],
};

const VariationsForm = () => {
  const [varieties, setVarieties] = React.useState(initialState);

  const handleAdd = () => {
    let data = { ...varieties };
    let { color, size, qty, instances } = data;
    instances.push({ color, size, qty });
    color = size = qty = "";
    data = { ...data, color, size, qty };
    setVarieties(data);
  };

  const handleInputChange = (e) => {
    console.log(`e.target`, e.target);
    const { value, name } = e.target;
    setVarieties({ ...varieties, [name]: value });
  };

  const selectDifinitions = variants.map((v) => ({
    inputLabel: v.type,
    labelId: `${v.type}-select-label`,
    name: `${v.type}`,
    value: varieties[v.type],
    values: v.values,
    onChange: handleInputChange,
  }));

  return (
    <>
      {selectDifinitions.map((d, i) => (
        <SelectForm key={i} {...d} />
      ))}
      <TextField
        id="qty"
        name="qty"
        label="qty"
        type="number"
        variant="standard"
        value={varieties.qty}
        onChange={handleInputChange}
      />
      <Button variant="outlined" color="primary" onClick={handleAdd}>
        Add
      </Button>
    </>
  );
};

const SelectForm = ({ labelId, inputLabel, values, name, value, onChange }) => {
  return (
    <FormControl style={{ marginRight: "1rem" }}>
      <InputLabel id={labelId}>{inputLabel}</InputLabel>
      <Select labelId={labelId} value={value} onChange={onChange} name={name}>
        {values.map((v) => (
          <MenuItem key={v} value={v}>
            {v}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default VariationsForm;
