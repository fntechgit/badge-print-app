import React from 'react';
import { Textfit } from 'react-textfit';

import {
    useForceUpdate,
    getMarketingBadgeSettings
} from '@/utils/utils';


import './styles/styles_1.less';
import default_background_img from './images/gen_background.png';
import access_level_1_img from './images/access_level_1.png';
import feature_1_img from './images/feature_1.png';


export default ({badge, marketingSettings}) => {
    const badgeSettings = getMarketingBadgeSettings(marketingSettings);
    const { 
        background,
        firstnameColor,
        lastnameColor,
        companyColor
    } = badgeSettings;
    const forceUpdate = useForceUpdate();
    const featureCirlces = badge.getFeatureCircles();
    const background_img = background.file || default_background_img;
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>

            <div id="logo-wrapper">
                {/** work in progress, ideally inserting a CMS uploaded image from API */}
                {/* {badge.getLogo() && <div className="logo-placeholder"><img src={badge.getLogo().image} /></div>} */}
            </div>

            <div id="text-on-badge" className="bdg-content text-box">
                <Textfit mode="single" max={45} className="first-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>
                    <span style={{color: firstnameColor.value}}>
                        {badge.getFirstName() || "First Name"}
                    </span>
                </Textfit>
                <Textfit mode="single" max={40} className="last-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>
                    <span style={{color: lastnameColor.value}}>
                        {badge.getLastName() || "Last Name"}
                    </span>
                </Textfit>
                <Textfit mode="single" max={35} className="company" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>
                    <span style={{color: companyColor.value}}>
                        {badge.getCompany() || "Company"}
                    </span>
                </Textfit>
                <Textfit mode="single" max={30} className="title" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getExtraQuestionValue('Job Title')}</Textfit>
            </div>

            <div id="badge-feature">
                {/** other badge features */}
                {/* <div class="badge-feature-placeholder">Badge Feature</div> */}
            </div>

            {badge.hasQRCode() &&
                <div id="qrcode" className="bdg-content qrcode-box">
                    {badge.getQRCode({ size: 80 })}
                </div>
            }

            {featureCirlces &&
                featureCirlces.map(feature => 
                    feature.image !== null && <div id="icon-feature" className="bdg-content icon-feature">
                        <img src={feature.image} />
                    </div>
                )
            }
        </div>
    </>
    );
}

