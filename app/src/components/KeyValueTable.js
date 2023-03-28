


function KeyValueTable(props) {

    let formatKey = (key) => {
        return key
    }
    if (props.boldKeys) {
        formatKey = (key) => {
            return <b>{key}</b>
        }
    }

    let rows = [];
    console.log(props.data);
    if (props.data) {
        for (const [key, value] of Object.entries(props.data)) {
            let valueStr = String(value);
            if (Array.isArray(value)) {
                valueStr = value.join(", ")
            };

            rows.push(
                <tr key={key}>
                    <td>{formatKey(key)}</td>
                    <td>{valueStr}</td>
                    </tr>
            )
        }
    }

    return (
        <table>
            <tbody>
                {rows}
            </tbody>
        </table>
    )


}

export default KeyValueTable;