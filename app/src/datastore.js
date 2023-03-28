import { USE_TEST_DATA, baseUrl } from "./globals";
import testDataWorkflows from "./test-data/workflows.json";
import testDataRecipes from "./test-data/recipes.json";

console.log(testDataRecipes);


// Stuff for making test data behave more like real data

let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}

// end

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function byDate(obj1, obj2) {
  // most recent first
  if (obj1.stages[0].start_time < obj2.stages[0].start_time) {
    return 1;
  }
  if (obj1.stages[0].start_time > obj2.stages[0].start_time) {
    return -1;
  }
  return 0;
}

class DataStore {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.cache = {
      workflows: {},
      recipes: {},
    };
  }

  get_request_config() {
    let token = sessionStorage.getItem("token");
    return {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  }

  async getWorkflows(collabSpace, searchFilters) {
    if (USE_TEST_DATA) {
      await fakeNetwork("testdata");
      const workflows = testDataWorkflows.sort(byDate);
      for (const index in workflows) {
        workflows[index].recipe = await this.getRecipe(workflows[index].recipe_id);
      }
      console.log(workflows);
      return workflows;
    }

    if (isEmpty(this.cache.workflows)) {
      console.log(baseUrl);
      let url = baseUrl + "/workflows/";
      if (collabSpace) {
        searchFilters.space = collabSpace;
      }
      if (searchFilters) {
        const query_params = new URLSearchParams(searchFilters).toString();
        url += "?" + query_params;
      }
      const config = this.get_request_config();
      console.log("Getting workflow executions from " + url);
      //return axios.get(url, config)
      const response = await fetch(url, config);
      const workflows = await response.json()
      console.log(workflows);
      let promises = [];
      workflows.forEach(async workflow => {
        if (workflow.recipe_id) {
          //workflow.recipe = await this.getRecipe(workflow.recipe_id)
          promises.push(this.getRecipe(workflow.recipe_id));
        }
      })
      const recipes = await Promise.all(promises);
      for (const index in workflows) {
        workflows[index].recipe = recipes[index];
        this.cache.workflows[workflows[index].id] = workflows[index];
      }
    }
    console.log(this.cache.workflows);
    const workflowArray = Object.values(this.cache.workflows);
    console.log(workflowArray);
    return workflowArray
  }

  async getWorkflow(uuid) {
    console.log("Getting workflow with id ", uuid);
    if (USE_TEST_DATA) {
      for (const index in testDataWorkflows) {
        const workflow = testDataWorkflows[index];
        if (workflow.id === uuid) {
          console.log(workflow);
          for (const index in workflow.stages) {
            workflow.stages[index].recipe = await this.getRecipe(workflow.stages[index].recipe_id)
          }
          return workflow;
        }
      }
      return null;
    }
    if (!this.cache.workflows[uuid]) {
      let url = baseUrl + "/workflows/" + uuid;
      const config = this.get_request_config();
      console.log("Getting workflow from " + url);
      const response = await fetch(url, config);
      let workflow = await response.json();
      if (workflow.recipe_id) {
        workflow.recipe = await this.getRecipe(workflow.recipe_id);
      }
      this.cache.workflows[uuid] = workflow;
    }
    let workflow = this.cache.workflows[uuid];
    for (const index in workflow.stages) {
      if (workflow.stages[index].recipe_id) {
        workflow.stages[index].recipe = await this.getRecipe(workflow.stages[index].recipe_id)
      }
    }
    return workflow;
  }

  async getRecipes(collabSpace, searchFilters) {
    if (USE_TEST_DATA) {
      await fakeNetwork("testdata");
      const recipes = testDataRecipes.sort(byDate);
      console.log(recipes);
      return recipes;
    }

    if (isEmpty(this.cache.recipes)) {
      console.log(baseUrl);
      let url = baseUrl + "/recipes/";
      if (collabSpace) {
        searchFilters.space = collabSpace;
      }
      if (searchFilters) {
        const query_params = new URLSearchParams(searchFilters).toString();
        url += "?" + query_params;
      }
      const config = this.get_request_config();
      console.log("Getting workflow executions from " + url);
      //return axios.get(url, config)
      const response = await fetch(url, config);
      const recipes = await response.json()
      console.log(recipes);
      for (const index in recipes) {
        this.cache.recipes[recipes[index].id] = recipes[index];
      }
    }
    console.log(this.cache.recipes);
    const recipeArray = Object.values(this.cache.recipes);
    console.log(recipeArray);
    return recipeArray
  }

  async getRecipe(recipeId) {
    if (USE_TEST_DATA) {
      console.log("looking up" + recipeId);
      await fakeNetwork("testdata");
      for (const index in testDataRecipes) {
        const recipe = testDataRecipes[index];
        if (recipe.id === recipeId) {
          console.log(recipe);
          return recipe;
        }
      }
      return {};
    }

    if (!this.cache.recipes[recipeId] || isEmpty(this.cache.recipes[recipeId])) {
      let url = baseUrl + "/recipes/" + recipeId;
      const config = this.get_request_config();
      console.log("Getting workflow recipe from " + url);
      //return axios.get(url, config)
      const response = await fetch(url, config);
      this.cache.recipes[recipeId] = await response.json();
    }
    console.log(this.cache.recipes[recipeId]);
    return this.cache.recipes[recipeId];
  }

}

const datastore = new DataStore(baseUrl);
export { datastore };
