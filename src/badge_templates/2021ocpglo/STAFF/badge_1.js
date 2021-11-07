import React from 'react';
import { Textfit } from 'react-textfit';

import './styles/styles_1.less';

// we use an extra pixel in image width, hack to help borderless printing
import background_img from './images/staff95x140.png';

export default ({badge}) => {
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
            <div className="text-box">
                <span className="first-name" contentEditable>{badge.getFirstName()}</span>
                <span className="last-name" contentEditable>{badge.getLastName()}</span>
                <span className="badge-title ocp-staff">OCP Staff</span>
                <span className="title" contentEditable>{badge.getCompany()}</span>
            </div>
        </div>
    </>
    );
}