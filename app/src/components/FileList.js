

function getHashStr(hashObj) {
    if (hashObj) {
        return `${hashObj.algorithm} ${hashObj.value}`;
    } else {
        return "";
    }
}


function FileList(props) {

    return (
        <div>
            <h6>{props.label}</h6>
            <ul>
            {
                props.files.map(file => (
                    <li>{file.file_name} {file.location} {file.description} {file.size} {file.format} {getHashStr(file.hash)}</li>
                ))
            }
            </ul>
        </div>
    )

}

export default FileList;