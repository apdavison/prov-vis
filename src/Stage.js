import React from 'react';

const colours = {
    entity: "moccasin",
    activity: "paleturquoise"
}

const TRUNCATE_AT = 20;

function truncate(str, n){
    return (str.length > n) ? str.substr(0, n-1) + "…" : str;
  };


function Stage(props) {
    const width = props.size.width;
    const height = props.size.height;
    let styleObj = {
        top: props.y - height/2 + "px",
        left: props.x - width/2 + "px",
        width: width + "px",
        height: height + "px",
        backgroundColor: colours[props.type],
        position: "absolute"
    };

    return (
        <div id="stage{props.label}" style={styleObj}>
            <div style={{padding: "5px"}}>
            <p class="avoid-overflow">{truncate(props.label, TRUNCATE_AT)}</p>
            <p>{props.timestamp}</p>
            <p>{props.attributedTo}</p>
            </div>
        </div>
    )
}

export default Stage;