import { Chip, Paper, Stack, Typography } from "@mui/material";
import KeyValueTable from "./KeyValueTable";

function Environment(props) {
  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Paper sx={{padding: 2}}>
        <KeyValueTable boldKeys data={{
          "Name": props.env.name,
          "Hardware": props.env.hardware,
          "Description": props.env.description,
          ...props.env.configuration
        }} />
        </Paper>
        <Paper sx={{padding: 2}}>
          <Typography variant="body1" gutterBottom><b>Software</b></Typography>

          {props.env.software.map((swv) => (
            <Chip label={`${swv.software_name} ${swv.software_version}`} sx={{marginRight: 1, marginBottom: 1}} />
          ))}

        </Paper>
      </Stack>
    </div>
  );
}

export default Environment;
