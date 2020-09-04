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
        backgroundColor: colours[props.type],
        position: "fixed"
    };

    return (
        <div id="stage{props.label}" style={styleObj}>
            <p>Stage {props.label}</p>
        </div>
    )
}

export default Stage;