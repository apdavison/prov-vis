import { Box, Chip, Paper, Typography } from "@mui/material";
import KeyValueTable from "./KeyValueTable";

function Environment(props) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      <Paper sx={{ padding: 2, flex: "1 1 300px", minWidth: 0 }}>
        <KeyValueTable boldKeys data={{
          "Name": props.env.name,
          "Hardware": props.env.hardware,
          "Description": props.env.description,
          ...props.env.configuration
        }} />
      </Paper>
      <Paper sx={{ padding: 2, flex: "1 1 300px", minWidth: 0 }}>
        <Typography variant="body1" gutterBottom><b>Software</b></Typography>

        {props.env.software.map((swv) => (
          <Chip key={`${swv.software_name} ${swv.software_version}`} label={`${swv.software_name} ${swv.software_version}`} sx={{marginRight: 1, marginBottom: 1}} />
        ))}

      </Paper>
    </Box>
  );
}

export default Environment;
