import React from 'react';

const colours = {
    entity: "moccasin",
    activity: "paleturquoise"
}

function Stage(props) {
    const width = props.size.width;
    const height = props.size.height;
    let styleObj = {
        top: props.y - height/2 + "px",
        left: props.x - width/2 + "px",
        width: width + "px",
        height: height + "px",
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