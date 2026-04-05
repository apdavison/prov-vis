import KeyValueTable from "./KeyValueTable";

function LaunchConfig(props) {
  let data = {
    "Command line": <pre>{props.config.executable} {props.config.arguments.join(" ")}</pre>,
    "Environment variables": props.environment || ""
  }
  return (
    <KeyValueTable boldKeys data={data} />
  );
}

export default LaunchConfig;
