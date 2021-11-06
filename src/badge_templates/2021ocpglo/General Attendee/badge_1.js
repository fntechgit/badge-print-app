import React from 'react';
import { Textfit } from 'react-textfit';

import './styles/styles_1.less';

import background_img from './images/background_1.png';

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
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
            <div className="text-box">
                <span className="first-name" contentEditable>{badge.getFirstName()}</span>
                <span className="last-name" contentEditable>{badge.getLastName()}</span>
                {badge.getFeature('Board Member Title') &&
                <span className="badge-title board-member-title">{badge.getFeature('Board Member Title').template_content.replace(/<[^>]+>/g, '')}</span>
                }
                {badge.getFeature('Project Lead Title') &&
                <span className="badge-title project-lead-title">{badge.getFeature('Project Lead Title').template_content.replace(/<[^>]+>/g, '')}</span>
                }
                {badge.getFeature('OCP Future Tech Symposium Title') &&
                <span className="badge-title symposium-title">{badge.getFeature('OCP Future Tech Symposium Title').template_content.replace(/<[^>]+>/g, '')}</span>
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
            <div id="icon-feature-expo" className="bdg-content icon-feature">
                <img className="bdg-image" src={badge.getFeature('Expo Sponsor Staff').image}/>
            </div>
            }
            {badge.getFeature('Speaker') && !badge.getFeature('Keynote') &&
            <div id="icon-feature-speaker" className="bdg-content icon-feature">
                <img className="bdg-image" src={badge.getFeature('Speaker').image}/>
            </div>
            }
            {badge.getFeature('Keynote') &&
            <div id="icon-feature-keynote" className="bdg-content icon-feature">
                <img className="bdg-image" src={badge.getFeature('Keynote').image}/>
            </div>
            }
            {badge.getFeature('Media') &&
            <div id="icon-feature-media" className="bdg-content icon-feature">
                <img className="bdg-image" src={badge.getFeature('Media').image}/>
            </div>
            }
            <div id="t-shirt-size" className="bdg-content">{ shirtSize[badge.getExtraQuestionValue('T-shirt Size')] }</div>
        </div>
    </>
    );
}

