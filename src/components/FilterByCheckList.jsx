import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

const CategoriesCheckList = () => {
  const categories = [
    { name: "PC", id: "1" },
    { name: "Stationary", id: "2" },
    { name: "Furniture", id: "3" },
    { name: "Sports", id: "4" },
  ];

  return (
    <FormControl component="fieldset">
      <FormGroup aria-label="position" row>
        {categories.map((c) => (
          <FormControlLabel
            value={c.id}
            control={<Checkbox color="primary" />}
            label={c.name}
            labelPlacement="end"
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

export default CategoriesCheckList;
