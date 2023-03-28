import {
  Paper,
  Table,
  TableBody,
  TableRow,
  TableContainer,
  TableCell,
} from "@mui/material";

function KeyValueTable(props) {
  let formatKey = (key) => {
    return key;
  };
  if (props.boldKeys) {
    formatKey = (key) => {
      return <b>{key}</b>;
    };
  }

  let rows = [];
  console.log(props.data);
  if (props.data) {
    for (const [key, value] of Object.entries(props.data)) {
      let valueStr = String(value);
      if (Array.isArray(value)) {
        valueStr = value.join(", ");
      }

      rows.push(
        <TableRow key={key} sx={{ "&:last-child td": { border: 0 } }}>
          <TableCell>{formatKey(key)}</TableCell>
          <TableCell>{valueStr}</TableCell>
        </TableRow>
      );
    }
  }

  return (
    <TableContainer component={Paper} sx={{width: "max-content"}}>
      <Table size="small" aria-label="key-value table">
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}

export default KeyValueTable;
