import React from 'react';

function HLine(props) {
    let styleObj = {
        top: props.y + "px",
        left: props.x0 + "px",
        width: (props.x1 - props.x0) + "px",
        height: "2px",
        "background-color": "gray",
        position: "fixed"
    };

    return (
        <div style={styleObj} />
    )
}

export default HLine;