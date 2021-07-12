import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Rating from "@material-ui/lab/Rating";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import StarBorderIcon from "@material-ui/icons/StarBorder";

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.primary.light,
  },
  ratingIndicator: {
    display: "flex",
    alignItems: "center",
  },
  tableHeaders: {
    backgroundColor: theme.palette.grey[100],
  },
  iconButtons: {
    borderRadius: 0,
    borderColor: theme.palette.grey[300],
    border: "1px solid",
    flex: 1,
  },
  cardContent: {
    padding: 0,
    borderColor: theme.palette.grey[300],
    border: "1px solid",
    borderBottom: 0,
  },
  cardActions: {
    padding: "8px 0",
  },
  card: {
    padding: "0 8px",
  },
  buttonLabels: {
    flexDirection: "column",
    ...theme.typography.caption,
  },
  icons: {
    fontSize: "20px",
  },
}));

const ProductDetailTable = ({ product }) => {
  const classes = useStyles();
  return (
    <CardContent classes={{ root: classes.cardContent }}>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell
                className={classes.tableHeaders}
                component="th"
                scope="row"
              >
                Price
              </TableCell>
              <TableCell component="td">AUD {product.price}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                component="th"
                className={classes.tableHeaders}
                scope="row"
              >
                Category
              </TableCell>
              <TableCell component="td">{product.category.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                component="th"
                className={classes.tableHeaders}
                scope="row"
              >
                Sub category
              </TableCell>
              <TableCell component="td">{product.subCategory.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                component="th"
                className={classes.tableHeaders}
                scope="row"
              >
                Brand
              </TableCell>
              <TableCell component="td">{product.brand}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                component="th"
                className={classes.tableHeaders}
                scope="row"
              >
                Available
              </TableCell>
              <TableCell component="td">{product.quantity}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  );
};

export default ProductDetailTable;
