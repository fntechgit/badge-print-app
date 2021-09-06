import React from 'react';
import { Textfit } from 'react-textfit';

import './styles/styles_1.less';

import background_img from './images/background_1.png';

export default ({badge}) => {
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
            <div className="text-box">
                <span className="first-name" contentEditable>{badge.getFirstName()}</span>
                <span className="last-name" contentEditable>{badge.getLastName()}</span>
                {badge.getFeature('Board Member Title') &&
                <span className="badge-title">{badge.getFeature('Board Member Title').template_content.replace(/<[^>]+>/g, '')}</span>
                }
                {badge.getFeature('Project Lead Title') &&
                <span className="badge-title">{badge.getFeature('Project Lead Title').template_content.replace(/<[^>]+>/g, '')}</span>
                }
                {badge.getFeature('OCP Future Tech Symposium Title') &&
                <span className="badge-title">{badge.getFeature('OCP Future Tech Symposium Title').template_content.replace(/<[^>]+>/g, '')}</span>
                }
                {badge.getFeature('Incubation Committee Title') &&
                <span className="badge-title">{badge.getFeature('Incubation Committee Title').template_content.replace(/<[^>]+>/g, '')}</span>
                }
                <span className="company" contentEditable>{badge.getCompany()}</span>
            </div>
            {badge.hasQRCode() &&
            <div id="qrcode" className="bdg-content qrcode-box">
                {badge.getQRCode({ fgColor: '#1e2860', size: 80 })}
            </div>
            }
            {badge.getFeature('Expo Icon') &&
            <div id="icon-feature-expo" className="bdg-content icon-feature">
                <img className="bdg-image" src={badge.getFeature('Expo Icon').image}/>
            </div>
            }
            {badge.getFeature('Speaker Icon') && !badge.getFeature('Keynote Icon') &&
            <div id="icon-feature-speaker" className="bdg-content icon-feature">
                <img className="bdg-image" src={badge.getFeature('Speaker Icon').image}/>
            </div>
            }
            {badge.getFeature('Keynote Icon') &&
            <div id="icon-feature-keynote" className="bdg-content icon-feature">
                <img className="bdg-image" src={badge.getFeature('Keynote Icon').image}/>
            </div>
            }
            {badge.getFeature('Media Icon') &&
            <div id="icon-feature-media" className="bdg-content icon-feature">
                <img className="bdg-image" src={badge.getFeature('Media Icon').image}/>
            </div>
            }
        </div>
    </>
    );
}

