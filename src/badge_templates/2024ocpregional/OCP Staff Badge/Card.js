import React from 'react';
import { Textfit } from 'react-textfit';

import {
    useForceUpdate
} from '@/utils/utils';

import './styles/card.less';

import background_img from './images/staff267x396.png';

const shirtSize = {
    'Unisex XS': '.',
    'Unisex S': '..',
    'Unisex M': '...',
    'Unisex L': '....',
    'Unisex XL': '....-',
    'Unisex 2XL': '....--',
    'Unisex 3XL': '....---',
}

export default ({badge}) => {
    const forceUpdate = useForceUpdate();
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard card">
            <img id="badge-artboard-img" className="bdg-image bdg-image-front" src={background_img}/>
            <div className="text-box">
                <Textfit mode="single" max={42} className="first-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                <Textfit mode="single" max={42} className="last-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>
                <div className="divider"></div>
            </div>
            {badge.getExtraQuestionValue('Job Title') &&
                <span
                    className="attendee-title"
                    contentEditable
                    suppressContentEditableWarning={true}
                >
                    {badge.getExtraQuestionValue('Job Title')}
                </span>
            }
            {badge.getExtraQuestionValue('T-shirt Size') &&
            <div id="t-shirt-size" className="bdg-content">{shirtSize[badge.getExtraQuestionValue('T-shirt Size')]}</div>
            }
        </div>
    </>
    );
}

