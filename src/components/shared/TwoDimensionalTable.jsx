/**
 * input: [
    {
      color: {
        index: 0,
        name: "red",
      },
      size: {
        index: 1,
        name: "s",
      },
      qty: "1",
    },
    ...
  ]
  * output: {
    color: [
      { index: 0, name: "red" },
      ...
    ],
    size: [
      { index: 1, name: "s" },
      ...
    ],
    * qty[i].length === color.length
    * qty[i][j].length === size.length
    qty: [
      ["1", null, "1"],
      ...
    ],
  };
 */

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { getSummary } from "../../util/getSummary";

const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },
});

const TwoDimensionalTable = ({ variations }) => {
  const classes = useStyles();
  const summary = getSummary(variations);

  const renderedTableHeader = () => (
    <>
      <TableCell></TableCell>
      {summary.color.map((c, i) => (
        <TableCell key={`tableHeader${i}`} align="center">
          {c.name}
        </TableCell>
      ))}
    </>
  );

  const renderedTableBody = () =>
    summary.size.map((s, i) => (
      <TableRow key={`tableRow${i}`}>
        <TableCell align="center" component="th" scope="row">
          {s.name}
        </TableCell>
        {summary.qty.map((q, idx) => (
          <TableCell id={`${i},${idx}`} key={`tableCell${idx}`} align="center">
            {q[i] === 0 ? "sold out" : q[i]}
          </TableCell>
        ))}
      </TableRow>
    ));

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>{renderedTableHeader()}</TableRow>
        </TableHead>
        <TableBody>{renderedTableBody()}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default TwoDimensionalTable;
