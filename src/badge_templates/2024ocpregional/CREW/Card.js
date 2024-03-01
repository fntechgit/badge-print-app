import React, { useState } from 'react';
import { Textfit } from 'react-textfit';

import {
    useForceUpdate
} from '@/utils/utils';

import './styles/styles_1.less';

import background_img from './images/crew95x140.png';

export default ({badge}) => {
    const forceUpdate = useForceUpdate();
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            <img className="bdg-image" src={background_img}/>
            <div className="content-wrapper">
                <Textfit mode="single" max={50} className="first-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                <Textfit mode="single" max={32} className="last-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>
            </div>
        </div>
    </>
    );
}

