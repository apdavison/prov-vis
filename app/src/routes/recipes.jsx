import React from "react";
import { Await, defer, useLoaderData } from "react-router-dom";

import { datastore } from "../datastore";
import Navigation from "../components/Navigation";
import RecipeTable from "../components/RecipeTable";
import ProgressIndicator from "../components/ProgressIndicator";

export async function loader() {
  const recipesPromise = datastore.getRecipes(null, {});
  //console.log(recipesPromise);
  return defer({ recipes: recipesPromise });
}

function Recipes(props) {
  const data = useLoaderData();

  return (
    <div id="recipes">
      <Navigation location={["Recipes"]} />

      <React.Suspense fallback={<ProgressIndicator />}>
        <Await
          resolve={data.recipes}
          errorElement={<p>Error loading workflow recipes.</p>}
        >
          {(recipes) => <RecipeTable recipes={recipes} />}
        </Await>
      </React.Suspense>
    </div>
  );
}

export default Recipes;
