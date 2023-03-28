function fullName(person) { // todo: add link if ORCID provided
    if (person) {
        return person.given_name + " " + person.family_name
    } else {
        return ""
    }
}

function getTimeStamp(stages) {
  const timestamps = stages.map(stage => new Date(stage.start_time));
  return timestamps.sort()[0].toISOString()
}

function getRecipeName(recipe) {
    if (recipe) {
        return recipe.name;
    } else {
        return "";
    }
}

function getDevelopersString(developers) {
    let names = developers.map(person => fullName(person));
    return names.join(", ")
  }

export { fullName, getTimeStamp, getRecipeName, getDevelopersString }