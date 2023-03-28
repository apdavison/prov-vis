import KeyValueTable from "./KeyValueTable";

function LaunchConfig(props) {
  return (
    <KeyValueTable boldKeys data={props.config} />
  );
}

export default LaunchConfig;
