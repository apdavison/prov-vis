import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Avatar, CssBaseline, AppBar, Toolbar, Typography, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./index.css";
import { datastore } from "./datastore";
import Home from "./routes/home";
import ErrorPage from "./error-page";
import Workflows, { loader as workflowsLoader } from "./routes/workflows";
import Workflow, { loader as workflowLoader } from "./routes/workflow-detail";
import WorkflowGraph from "./routes/workflow-graph";
import Recipes, { loader as recipesLoader } from "./routes/recipes";
import Recipe, { loader as recipeLoader } from "./routes/recipe-detail";
import initAuth from './auth';


const theme = createTheme({
  typography: {
    h2: {
      fontSize: "1.6rem"
    },
    h3: {
      fontSize: "1.3rem"
    },
    h4: {
      fontSize: "1.2rem"
    }
  },
  palette: {
    background: {
      default: "#f7f7f7"
    }
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "workflows/",
    element: <Workflows />,
    loader: workflowsLoader,
  },
  {
    path: "workflows/:workflowId",
    element: <Workflow />,
    loader: workflowLoader,
  },
  {
    path: "workflows/:workflowId/graph",
    element: <WorkflowGraph />,
    loader: workflowLoader,
  },
  {
    path: "recipes/",
    element: <Recipes />,
    loader: recipesLoader,
  },
  {
    path: "recipes/:recipeId",
    element: <Recipe />,
    loader: recipeLoader,
  },

]);


function renderApp(auth) {
  datastore.auth = auth;
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="relative" sx={{ backgroundImage: "linear-gradient(to right, #00395d, #5cc766)"}} >
          <Toolbar>
            <Avatar sx={{ mr: 2 }} alt="EBRAINS" src={process.env.PUBLIC_URL + "/favicon.png"} />
            <Typography variant="h6" color="inherit" noWrap>
              EBRAINS: workflow provenance (alpha)
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <Container maxWidth="xl" >
            <RouterProvider router={router} />
          </Container>
        </main>
      </ThemeProvider>
    </React.StrictMode>
  );
};


window.addEventListener('DOMContentLoaded', () => initAuth(renderApp));
//window.addEventListener('DOMContentLoaded', () => renderApp(null));