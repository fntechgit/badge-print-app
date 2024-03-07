import React from 'react';
import { Textfit } from 'react-textfit';

import {
    useForceUpdate
} from '@/utils/utils';

import './styles/card.less';

import background_img from './images/general267x396.png';
import board_img from './images/board267x396.png';
import lead_img from './images/lead267x396.png';
import steering_img from './images/steering267x396.png';
import symposium_img from './images/symposium267x396.png';

const shirtSize = {
    'Unisex XS': '.',
    'Unisex S': '..',
    'Unisex M': '...',
    'Unisex L': '....',
    'Unisex XL': '....-',
    'Unisex 2XL': '....--',
    'Unisex 3XL': '....---',
}

const getFeatureCirclesLogic = (badge) => {
    const features = badge.getFeatureCircles();
    if (features.some(f => f.name === "Speaker") && features.some(f => f.name === "Keynote")) {
        return features.filter(f => f.name !== "Speaker");
    }
    return features;
}

export default ({badge}) => {
    const featuresCircles = getFeatureCirclesLogic(badge);
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
    if (badge.getFeature('Symposium Title') && !badge.getFeature('Project Lead Title') && !badge.getFeature('Steering Committee Title') && !badge.getFeature('Board Member Title')) {
        backgroundImage = symposium_img;
    }
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard card">
            <img id="badge-artboard-img" className="bdg-image bdg-image-front" src={backgroundImage}/>
            <div className="text-box">
                <Textfit mode="single" max={50} className="first-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                <Textfit mode="single" max={50} className="last-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>
                <Textfit mode="single" max={30} className="company" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getCompany()}</Textfit>
            </div>
            {badge.hasQRCode() &&
            <div id="qrcode" className="bdg-content qrcode-box">
                {badge.getQRCode({ fgColor: '#19194D', bgColor: '#ffffff', size: 70 })}
            </div>
            }
            {featuresCircles.length < 3 ?
                <div id="circle_feature_two">
                    {featuresCircles[0] && <div className="bdg-content icon-feature-2">
                        <img className="bdg-image" src={featuresCircles[0].image}/>
                    </div>}
                    {featuresCircles[1] && <div className="bdg-content icon-feature-2">
                        <img className="bdg-image" src={featuresCircles[1].image}/>
                    </div>}
                </div>
                :
                <div id="circle_feature_all">
                    {featuresCircles.map(feature => 
                    <div className="bdg-content icon-feature">
                        <img className="bdg-image" src={feature.image}/>
                    </div>
                    )}
                </div>
            }
        </div>
    </>
    );
}

