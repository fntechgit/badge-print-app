import React, { useState, useLayoutEffect } from 'react';
import { Textfit } from 'react-textfit';

import {
  useForceUpdate
} from "@/utils/utils";

import './styles/card.less';

import background_img from './images/general_attendee.png';
import staff_background_img from './images/staff.png';

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
    media: "Media Badge"
  };

export default ({badge}) => {
    const forceUpdate = useForceUpdate();
    const badgeType = badge.getBadgeTypeName();
    const [backgroundImg, setBackgroundImg] = useState(background_img);
    const profileLink = badge.getExtraQuestionValue("Strava Profile Link_SUBQUESTION_Yes_VIP") || badge.getExtraQuestionValue("Strava Profile Link_SUBQUESTION_Yes")
    const showProfileLink = !!profileLink
    useLayoutEffect(() => {
      if (badgeType == null) return;
      switch (badgeType) {
      case BadgeTypes.generalAttendee:
        setBackgroundImg(background_img);
        break;
      case BadgeTypes.staff:
        setBackgroundImg(staff_background_img);
        break;
      }
    }, [badgeType]);
    return (
    <>
        <div id="badge-artboard" className={`bdg-artboard card ${badgeType === "Staff/Employee Badge" ? "staff-badge" : ""}`}>
            <div className="badge-feature-wrapper">
                {badge.getFeature('Speaker') && badgeType !== "Media Badge" && <div className="badge-feature speaker">Speaker</div>}
                {badgeType === "Media Badge" && !badge.getFeature('Speaker') && <div className="badge-feature media">Media</div>}
            </div>
            <img id="badge-artboard-img" className="bdg-image bdg-image-front" src={backgroundImg}/>
            <div className="text-box">
                <Textfit mode="single" max={50} className="first-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                <Textfit mode="single" max={50} className="last-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>       
                <Textfit mode="single" max={16} className="pronouns" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getExtraQuestionValue("Pronouns") || badge.getExtraQuestionValue("Pronouns - VIP")}</Textfit>                       
            </div>
            <div className="title-company">
                {badge.getExtraQuestionValue("Role/Title") && <Textfit mode="single" max={20} className="title" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getExtraQuestionValue('Role/Title')}</Textfit>}
                <Textfit mode="single" max={20} className="company" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getCompany()}</Textfit>
            </div>
            {showProfileLink &&
              <div className="qr-code-wrapper">
                <span>Follow me on Strava</span>
                <div id="qrcode" className="bdg-content qrcode-box">
                  {badge.getCustomQRCode(profileLink,{ fgColor: '#19194D', bgColor: '#ffffff', size: 70 })}
                </div>
              </div>
            }
        </div>
    </>
    );
}

