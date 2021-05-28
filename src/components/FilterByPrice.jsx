import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles({
  root: {
    // width: 200,
  },
});

function valuetext(value) {
  return `$${value[0]} ~ $${value[1]}`;
}

const FilterByPrice = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState([0, 10000]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        {valuetext(value)}
      </Typography>
      <Slider
        step={10}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
        min={0}
        max={10000}
      />
    </div>
  );
};

export default FilterByPrice;
