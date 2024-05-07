import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Textfit } from 'react-textfit';

import {
  useForceUpdate
} from "@/utils/utils";

import './styles/zebra-card.less';

import general_background_img from './images/general.png';
import staff_background_img from './images/staff.png';
import speaker_background_img from './images/speaker.png';
import media_background_img from './images/media.png';
import partner_background_img from './images/partner.png';

// NO QR
import general_background_img_noqr from './images/noqr_general.png';
import staff_background_img_noqr from './images/noqr_staff.png';
import speaker_background_img_noqr from './images/noqr_speaker.png';
import media_background_img_noqr from './images/noqr_media.png';

const shirtSize = {
    'Unisex XS': '.',
    'Unisex S': '..',
    'Unisex M': '...',
    'Unisex L': '....',
    'Unisex XL': '....-',
    'Unisex 2XL': '....--',
    'Unisex 3XL': '....---',
}

const BadgeTypes = {
    generalAttendee: "General Attendee Badge",
    staff: "Staff/Employee Badge",
    media: "Media Badge",
  };

export default ({badge}) => {
    const forceUpdate = useForceUpdate();
    const badgeType = badge.getBadgeTypeName();
    const [backgroundImg, setBackgroundImg] = useState(general_background_img);
    const [isPartnerFeature, setIsPartnerFeature] = useState(false);
    const profileLink = badge.getExtraQuestionValue("Strava Profile Link_SUBQUESTION_Yes_VIP") || badge.getExtraQuestionValue("Strava Profile Link_SUBQUESTION_Yes");
    const showProfileLink = !!profileLink;
    const isStaffBadge = (badgeType === BadgeTypes.staff) && !badge.getFeature('Speaker');
    let general_background = general_background_img;
    let staff_background = staff_background_img;
    let speaker_background = speaker_background_img;
    let media_background = media_background_img;

    if(!profileLink) {
      general_background = general_background_img_noqr;
      staff_background = staff_background_img_noqr;
      speaker_background = speaker_background_img_noqr
      media_background = media_background_img_noqr;
    }
    useLayoutEffect(() => {
      if (badgeType == null) return;
      switch (badgeType) {
      case BadgeTypes.generalAttendee:
        setBackgroundImg(general_background);
        break;
      case BadgeTypes.staff:
        setBackgroundImg(staff_background);
        break;
      case BadgeTypes.media: 
        setBackgroundImg(media_background);
        break;
      }
    }, [badgeType]);

    useEffect(() => {
      if(badge.getFeature('Speaker')) {
        setBackgroundImg(speaker_background);
      }
      if(badge.getFeature('Partner Support')) {
        setBackgroundImg(partner_background_img);
        setIsPartnerFeature(true);
      }
    },[]);
    return (
    <>
        <div id="badge-artboard" className={`bdg-artboard card ${isStaffBadge ? "staff-badge" : ""}`}>
            <img id="badge-artboard-img" className="bdg-image bdg-image-front" src={backgroundImg}/>
            <div className="text-box">
                <Textfit mode="single" max={45} className="first-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                <Textfit mode="single" max={45} className="last-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>       
                {!isPartnerFeature && <Textfit mode="single" max={15} className="pronouns" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getPronouns() || badge.getExtraQuestionValue("Pronouns - VIP")}</Textfit>}                       
            </div>
            {!isPartnerFeature && <div className="title-company">
                {badge.getExtraQuestionValue("Role/Title") && <Textfit mode="single" max={19} className="title" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getExtraQuestionValue('Role/Title')}</Textfit>}
                <Textfit mode="single" max={19} className="company" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getCompany()}</Textfit>
            </div>}
            {showProfileLink && !isPartnerFeature &&
              <div className="qr-code-wrapper">
                <div id="qrcode" className="bdg-content qrcode-box">
                  {badge.getCustomQRCode(profileLink,{ fgColor: '#000000', bgColor: '#ffffff', size: 70 })}
                </div>
              </div>
            }
        </div>
    </>
    );
}

