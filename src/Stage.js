import React from 'react';

const colours = {
    entity: "moccasin",
    activity: "paleturquoise"
}

function Stage(props) {
    let styleObj = {
        top: props.y + "px",
        left: props.x + "px",
        width: "150px",
        height: "100px",
        "background-color": colours[props.type],
        position: "fixed"
    };

    return (
        <div id="stage{props.id}" style={styleObj}>
            <p>Stage {props.id}</p>
        </div>
    )
}

export default Stage;