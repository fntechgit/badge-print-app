import React, { useState } from 'react';
import { Textfit } from 'react-textfit';

import {
    useForceUpdate
} from '@/utils/utils';

import './styles/styles_1.less';

import background_img from './images/crew94x140.svg';

export default ({badge}) => {
    const forceUpdate = useForceUpdate();
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            <img className="bdg-image" src={background_img}/>
            <div className="content-wrapper">
                <Textfit mode="single" max={42} className="first-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                <Textfit mode="single" max={42} className="last-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>
            </div>
        </div>
    </>
    );
}

