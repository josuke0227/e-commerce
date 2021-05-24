import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  textInput: theme.inputForm,
}));

const TextInputGenerator = ({ definitions = [] }) => {
  const classes = useStyles();

  return definitions.map((d, i) => (
    <TextField key={i} className={classes.textInput} {...d} />
  ));
};

export default TextInputGenerator;
