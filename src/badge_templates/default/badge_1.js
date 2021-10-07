import React from 'react';
import { Textfit } from 'react-textfit';

import './styles/styles_1.less';
import background_img from './images/background_1.png';
import access_level_1_img from './images/access_level_1.png';
import feature_1_img from './images/feature_1.png';


export default ({badge}) => {
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>

            <div id="name-on-badge" className="bdg-content text-box text-box-1">
                <Textfit mode="single" max={35} className="box-content">{badge.getFullName()}</Textfit>
            </div>
            <div id="company" className="bdg-content text-box text-box-2">
                <Textfit mode="single" max={35} className="box-content">{badge.getCompany()}</Textfit>
            </div>

            {badge.hasQRCode() &&
            <div id="qrcode" className="bdg-content qrcode-box">
                {badge.getQRCode({ size: 90 })}
            </div>
            }

            {badge.getFeature('VIP Access') &&
            <div id="icon-feature-1" className="bdg-content icon-feature">
                <img className="bdg-image" src={feature_1_img}/>
            </div>
            }

        </div>
    </>
    );
}

