import React from 'react';
import { Textfit } from 'react-textfit';

import {
    useForceUpdate
} from '@/utils/utils';

import './styles/styles_1.less';

import background_img from './images/staff94x140.svg';
import logo from './images/hex-logo.svg';

export default ({badge}) => {
    const forceUpdate = useForceUpdate();
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
            <div className="text-box">
                <Textfit mode="single" max={42} className="first-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                <Textfit mode="single" max={42} className="last-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>
                <span className="badge-title ocp-staff">OCP Staff</span>
                <Textfit mode="single" max={24} className="attendee-title" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getExtraQuestionValue('Job Title')}</Textfit>
            </div>
            <div className="bdg-content hex-logo">
                <img className="bdg-image" src={logo}/>
            </div>
        </div>
    </>
    );
}