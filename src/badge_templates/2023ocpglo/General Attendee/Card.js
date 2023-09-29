import React from 'react';
import { Textfit } from 'react-textfit';

import {
    useForceUpdate
} from '@/utils/utils';

import './styles/card.less';

import background_img from './images/general94x140.png';
import board_img from './images/board94x140.png';
import lead_img from './images/lead94x140.png';
import steering_img from './images/steering94x140.png';
import symposium_img from './images/symposium94x140.png';

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
    let backgroundImage = background_img;
    if (badge.getFeature('Board Member Title')) {
        backgroundImage = board_img;
    }
    if (badge.getFeature('Steering Committee Title') && !badge.getFeature('Board Member Title')) {
        backgroundImage = steering_img;
    }
    if (badge.getFeature('Project Lead Title') && !badge.getFeature('Steering Committee Title') && !badge.getFeature('Board Member Title')) {
        backgroundImage = lead_img;
    }
    if (badge.getFeature('OCP Future Tech Symposium Title') && !badge.getFeature('Project Lead Title') && !badge.getFeature('Steering Committee Title') && !badge.getFeature('Board Member Title')) {
        backgroundImage = symposium_img;
    }
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard card">
            <img id="badge-artboard-img" className="bdg-image bdg-image-front" src={backgroundImage}/>
            <div className="text-box">
                <Textfit mode="single" max={50} className="first-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                <Textfit mode="single" max={32} className="last-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>
                <Textfit mode="single" max={21} className="company" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getCompany()}</Textfit>
            </div>
            {badge.hasQRCode() &&
            <div id="qrcode" className="bdg-content qrcode-box">
                {badge.getQRCode({ fgColor: '#000000', size: 70 })}
            </div>
            }
            {badge.getFeature('Expo Sponsor Staff') &&
            <div className="bdg-content icon-feature">
                <img className="bdg-image" src={badge.getFeature('Expo Sponsor Staff').image}/>
            </div>
            }
            {badge.getFeature('Speaker') && !badge.getFeature('Keynote') &&
            <div className="bdg-content icon-feature">
                <img className="bdg-image" src={badge.getFeature('Speaker').image}/>
            </div>
            }
            {badge.getFeature('Keynote') &&
            <div className="bdg-content icon-feature">
                <img className="bdg-image" src={badge.getFeature('Keynote').image}/>
            </div>
            }
            {badge.getFeature('Media') &&
            <div className="bdg-content icon-feature">
                <img className="bdg-image" src={badge.getFeature('Media').image}/>
            </div>
            }
            {badge.getExtraQuestionValue('T-shirt Size') &&
            <div id="t-shirt-size" className="bdg-content">{shirtSize[badge.getExtraQuestionValue('T-shirt Size')]}</div>
            }
        </div>
    </>
    );
}

