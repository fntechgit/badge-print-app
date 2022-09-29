import React from 'react';
import { Textfit } from 'react-textfit';

import {
    useForceUpdate
} from '@/utils/utils';

import './styles/styles_1.less';

import background_img from './images/general94x140.svg';

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
        <div id="badge-artboard" className="bdg-artboard">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
            <div className="text-box">
                <Textfit mode="single" max={42} className="first-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                <Textfit mode="single" max={42} className="last-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>
                {badge.getFeature('OCP Future Tech Symposium Title') &&
                <span className="badge-title symposium-title">{badge.getFeature('OCP Future Tech Symposium Title').template_content.replace(/<[^>]+>/g, '')}</span>
                }
                {badge.getFeature('Project Lead Title') &&
                <span className="badge-title project-lead-title">{badge.getFeature('Project Lead Title').template_content.replace(/<[^>]+>/g, '')}</span>
                }
                {badge.getFeature('Board Member Title') &&
                <span className="badge-title board-member-title">{badge.getFeature('Board Member Title').template_content.replace(/<[^>]+>/g, '')}</span>
                }
                {badge.getFeature('Incubation Committee Title') &&
                <span className="badge-title incubation-committee-title">{badge.getFeature('Incubation Committee Title').template_content.replace(/<[^>]+>/g, '')}</span>
                }
                <span className="company" contentEditable>{badge.getCompany()}</span>
            </div>
            {badge.hasQRCode() &&
            <div id="qrcode" className="bdg-content qrcode-box">
                {badge.getQRCode({ fgColor: '#1e2860', size: 80 })}
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
            <div id="t-shirt-size" className="bdg-content">{ shirtSize[badge.getExtraQuestionValue('T-shirt Size')] }</div>
        </div>
    </>
    );
}

