import React from "react";
import { Await, defer, useLoaderData } from "react-router-dom";

import { datastore } from "../datastore";
import Navigation from "../components/Navigation";
import WorkflowTable from "../components/WorkflowTable";
import ProgressIndicator from "../components/ProgressIndicator";


export async function loader() {
  const workflowsPromise = datastore.getWorkflows(null, {});
  //console.log(workflowsPromise);
  return defer({ workflows: workflowsPromise });
}

function Workflows(props) {
  const data = useLoaderData();

  return (
    <div id="workflows">
      <Navigation location={["Runs"]} />

      <React.Suspense fallback={<ProgressIndicator />}>
        <Await
          resolve={data.workflows}
          errorElement={<p>Error loading workflow runs.</p>}
        >
          {(workflows) => <WorkflowTable workflows={workflows} />}
        </Await>
      </React.Suspense>
    </div>
  );
}

export default Workflows;
