import React, { useState } from 'react';
import { Textfit } from 'react-textfit';

import './styles/styles_1.less';

// we use an extra pixel in image width, hack to help borderless printing
import background_img from './images/crew95x140.png';


function useForceUpdate(){
    const [value, setValue] = useState(0);
    console.log("forceUpdate")
    return () => setValue(value => value + 1);
}

export default ({badge}) => {

    const forceUpdate = useForceUpdate();

    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
            <div className="text-box">
                <Textfit mode="single" max={48} className="first-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                <Textfit mode="single" max={35} className="last-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>
            </div>
        </div>
    </>
    );
}

