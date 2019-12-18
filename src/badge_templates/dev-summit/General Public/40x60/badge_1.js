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

            {badge.getAccessLevel('Headquarters') &&
            <div id="icon-access-1" className="bdg-content icon-access">
                <img className="bdg-image" src={access_level_1_img}/>
            </div>
            }

            <div id="name-on-badge" className="bdg-content text-box text-box-1">
                <Textfit mode="single" max={35} className="badge-content">{badge.getFullName()}</Textfit>
            </div>
            <div id="irc-handle" className="bdg-content text-box text-box-2">
                <Textfit mode="single" max={35} className="badge-content">{badge.getIRC()}</Textfit>
            </div>
            <div id="company" className="bdg-content text-box text-box-3">
                <Textfit mode="single" max={35} className="badge-content">{badge.getCompany()}</Textfit>
            </div>
            <div id="twitter" className="bdg-content text-box text-box-4">
                <Textfit mode="single" max={35} className="badge-content">{badge.getTwitter()}</Textfit>
            </div>

            {badge.hasQRCode() &&
            <div id="qrcode" className="bdg-content qrcode-box">
                {badge.getQRCode()}
            </div>
            }

            {badge.getFeature('VIP Access') &&
            <div id="icon-honorary-1" className="bdg-content icon-honorary">
                <img className="bdg-image" src={feature_1_img}/>
            </div>
            }

        </div>
    </>
    );
}

