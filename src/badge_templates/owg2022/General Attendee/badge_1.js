import React from 'react';
import { Textfit } from 'react-textfit';

import './styles/styles_1.less';

// we use an extra pixel in image width, hack to help borderless printing
import background_img from './images/general95x140.png';
import info_img from './images/info.png';

export default ({badge}) => {
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
            <div className="text-box">
                <span className="last-name" contentEditable>{badge.getLastName()}</span>
                <span className="first-name" contentEditable>{badge.getFirstName()}</span>
                <span className="company" contentEditable>{badge.getCompany()}</span>
            </div>
            <img className="bdg-image" src={info_img}/>
        </div>
    </>
    );
}