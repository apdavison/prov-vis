import { Link as RouterLink } from "react-router-dom";
import { Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";

export default function Home() {
  const cardLayout = { padding: 8, height: 200, width: 400, textAlign: "center" };
  return (
    <div>
      <Stack direction="row" spacing={5} sx={{ margin: 5}}>
      <Card sx={cardLayout}>
        <CardActionArea sx={{verticalAlign: "middle"}} component={RouterLink} to={`workflows/`}>
          <CardContent>
            <Typography variant="h2">Workflow runs</Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <Card sx={cardLayout}>
        <CardActionArea component={RouterLink} to={`recipes/`}>
          <CardContent>
            <Typography variant="h2">Workflow recipes</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      </Stack>
    </div>
  );
}
