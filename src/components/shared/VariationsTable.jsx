import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { IconButton } from "@material-ui/core";
import {
  DeleteOutlineSharp as DeleteIcon,
  EditOutlined as EditICon,
} from "@material-ui/icons/";
import { getObjectKeysSet } from "../../util/getObjectKeysSet";

const useStyles = makeStyles({
  container: {
    marginTop: "1rem",
  },
});

// instances: [
//   {
//     size: '{index: 0, name: "xs"}',
//     qty: "1",
//   },
// ],

const VariationsTable = ({
  variations,
  handleDeleteClick,
  handleEditClick,
  qty,
  currentQty,
}) => {
  const classes = useStyles();

  if (variations.length > 0)
    return (
      <TableContainer component={Paper} className={classes.container}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {getObjectKeysSet(variations).map((k) => (
                <TableCell key={k}>{k}</TableCell>
              ))}
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {variations.map((r, i) => (
              <TableRow key={i}>
                {getObjectKeysSet(variations).map((k) => {
                  const value = k === "qty" ? r[k] : r[k].name;
                  return (
                    <TableCell key={k} component="td" scope="row">
                      {value}
                    </TableCell>
                  );
                })}
                <TableCell>
                  <IconButton
                    disabled={qty <= currentQty}
                    color="primary"
                    onClick={() => handleEditClick(r, i)}
                  >
                    <EditICon style={{ fontSize: "1rem" }} />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteClick(i)}
                  >
                    <DeleteIcon style={{ fontSize: "1rem" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );

  return <div className="" />;
};

export default VariationsTable;
