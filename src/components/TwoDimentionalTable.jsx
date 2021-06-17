/**
 * input: [
    { color: "Red", qty: "1", size: "S" },
    { color: "Red", qty: "2", size: "M" },
    { color: "Red", qty: "3", size: "L" },
    { color: "Blue", qty: "1", size: "S" },
    { color: "Blue", qty: "2", size: "M" },
    { color: "Blue", qty: "3", size: "L" },
    ...
  ];
  * output: JSX
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
import { getSummary } from "../util/getSummary";

const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },
});

const variations = [
  { color: "Red", qty: "1", size: "S" },
  { color: "Red", qty: "2", size: "M" },
  { color: "Red", qty: "3", size: "L" },
  { color: "Blue", qty: "1", size: "S" },
  { color: "Blue", qty: "2", size: "M" },
  { color: "Blue", qty: "3", size: "L" },
  { color: "Green", qty: "1", size: "S" },
  { color: "Green", qty: "2", size: "M" },
  { color: "Green", qty: "3", size: "L" },
  { color: "Yellow", qty: "1", size: "S" },
  { color: "Yellow", qty: "3", size: "M" },
  { color: "Yellow", qty: "3", size: "L" },
];

const TwoDimentionalTable = () => {
  const classes = useStyles();
  const summary = getSummary(variations);

  const renderedTableHeader = () => (
    <>
      <TableCell></TableCell>
      {summary.color.map((c, i) => (
        <TableCell key={i} align="center">
          {c}
        </TableCell>
      ))}
    </>
  );

  const renderedTableBody = () =>
    summary.size.map((s, i) => (
      <TableRow key={i}>
        <TableCell align="center" component="th" scope="row">
          {s}
        </TableCell>
        {summary.qty.map((q) => (
          <TableCell align="center">{q[i] === 0 ? "sold out" : q[i]}</TableCell>
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

export default TwoDimentionalTable;
