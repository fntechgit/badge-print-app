import React from 'react';
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

            <div id="name-on-badge" className="bdg-content">
                <p className="badge-content">{badge.getFullName()}</p>
            </div>
            <div id="irc-handle" className="bdg-content ">
                <p className="badge-content">{badge.getIRC()}</p>
            </div>
            <div id="company" className="bdg-content ">
                <p className="badge-content">{badge.getCompany()}</p>
            </div>
            <div id="twitter" className="bdg-content ">
                <p className="badge-content">{badge.getTwitter()}</p>
            </div>

            {badge.hasQRCode() &&
            <div id="qrcode" className="bdg-content ">
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

