import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { getObjectKeysSet } from "../../util/getObjectKeysSet";

const VariationsTable = ({ variations }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {getObjectKeysSet(variations).map((k) => (
              <TableCell align="center" key={k}>
                {k}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {variations.map((v, i) => (
            <TableRow key={i}>
              {getObjectKeysSet(variations).map((k, i) =>
                k === "qty" ? (
                  <TableCell key={"tableCellA" + i} align="center">
                    {v[k]}
                  </TableCell>
                ) : (
                  <TableCell key={"tableCellB" + i} align="center">
                    {v[k].name}
                  </TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VariationsTable;
