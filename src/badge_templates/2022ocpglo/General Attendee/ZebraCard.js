import React from 'react';
import { Textfit } from 'react-textfit';

import {
    useForceUpdate
} from '@/utils/utils';

import './styles/zebra-card.less';

import background_img from './images/general89x142.2.svg';

import badge_feature_expo from './images/badge-feature-pms-expo.svg';
import badge_feature_keynote from './images/badge-feature-pms-keynote.svg';
import badge_feature_media from './images/badge-feature-pms-media.svg';
import badge_feature_speaker from './images/badge-feature-pms-speaker.svg';

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
        <div id="badge-artboard" className="bdg-artboard zebra-card">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
            <div className="text-box">
                <Textfit mode="single" max={42} className="first-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                <Textfit mode="single" max={42} className="last-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>
                {badge.getFeature('Board Member Title') &&
                <span className="badge-title board-member-title">{badge.getFeature('Board Member Title').template_content.replace(/<[^>]+>/g, '')}</span>
                }
                {badge.getFeature('Incubation Committee Title') &&
                !badge.getFeature('Board Member Title') &&
                <span className="badge-title incubation-committee-title">{badge.getFeature('Incubation Committee Title').template_content.replace(/<[^>]+>/g, '')}</span>
                }
                {badge.getFeature('Project Lead Title') &&
                !badge.getFeature('Incubation Committee Title') &&
                !badge.getFeature('Board Member Title') &&
                <span className="badge-title project-lead-title">{badge.getFeature('Project Lead Title').template_content.replace(/<[^>]+>/g, '')}</span>
                }
                {badge.getFeature('OCP Future Tech Symposium Title') &&
                !badge.getFeature('Project Lead Title') &&
                !badge.getFeature('Incubation Committee Title') &&
                !badge.getFeature('Board Member Title') &&
                <span className="badge-title symposium-title">{badge.getFeature('OCP Future Tech Symposium Title').template_content.replace(/<[^>]+>/g, '')}</span>
                }
                <Textfit mode="single" max={24} className="company" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getCompany()}</Textfit>
            </div>
            {badge.hasQRCode() &&
            <div id="qrcode" className="bdg-content qrcode-box">
                {badge.getQRCode({ fgColor: '#002554', size: 80 })}
            </div>
            }
            {badge.getFeature('Expo Sponsor Staff') &&
            <div className="bdg-content icon-feature">
                <img className="bdg-image" src={badge_feature_expo}/>
            </div>
            }
            {badge.getFeature('Speaker') && !badge.getFeature('Keynote') &&
            <div className="bdg-content icon-feature">
                <img className="bdg-image" src={badge_feature_speaker}/>
            </div>
            }
            {badge.getFeature('Keynote') &&
            <div className="bdg-content icon-feature">
                <img className="bdg-image" src={badge_feature_keynote}/>
            </div>
            }
            {badge.getFeature('Media') &&
            <div className="bdg-content icon-feature">
                <img className="bdg-image" src={badge_feature_media}/>
            </div>
            }
            <div id="t-shirt-size" className="bdg-content">{ shirtSize[badge.getExtraQuestionValue('T-shirt Size')] }</div>
        </div>
    </>
    );
}

