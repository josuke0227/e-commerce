import { CardActions, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import StarBorderIcon from "@material-ui/icons/StarBorder";

const useStyles = makeStyles((theme) => ({
  iconButtons: {
    borderRadius: 0,
    borderColor: theme.palette.grey[300],
    border: "1px solid",
    flex: 1,
  },
  cardActions: {
    padding: "8px 0",
  },
  buttonLabels: {
    flexDirection: "column",
    ...theme.typography.caption,
  },
  icons: {
    fontSize: "20px",
  },
}));

const ProductPageButtons = ({ handleStarButtonClick }) => {
  const classes = useStyles();

  return (
    <CardActions classes={{ root: classes.cardActions }}>
      <IconButton
        classes={{
          root: classes.iconButtons,
          label: classes.buttonLabels,
        }}
        color="secondary"
        size="small"
      >
        <FavoriteBorderIcon className={classes.icons} />
        <span>Add to wishlist</span>
      </IconButton>
      <IconButton
        color="default"
        size="small"
        classes={{
          root: classes.iconButtons,
          label: classes.buttonLabels,
        }}
        onClick={handleStarButtonClick}
      >
        <StarBorderIcon className={classes.icons} />
        <span>Leave rating</span>
      </IconButton>
    </CardActions>
  );
};

export default ProductPageButtons;
