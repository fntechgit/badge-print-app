import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Textfit } from 'react-textfit';

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

const BadgeTypes = {
    generalAttendee: "General Attendee Badge",
    staff: "Staff/Employee Badge",
    media: "Media Badge",
};

const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}

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
                <Textfit mode="single" max={45} onInput={forceUpdate} className="first-name" contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                <Textfit mode="single" max={45} onInput={forceUpdate} className="last-name" contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>       
                {!isPartnerFeature && <Textfit mode="single" max={15} className="pronouns" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getPronouns()}</Textfit>}                       
            </div>
            {!isPartnerFeature && 
              <>
                <div className={`title-section `}>
                    {badge.getExtraQuestionValue("Role/Title") && 
                      <Textfit 
                        mode={'multi'} 
                        max={17} 
                        className={`title ${showProfileLink ? 'with-qr' : ''}`} 
                        onInput={forceUpdate} 
                        contentEditable 
                        suppressContentEditableWarning={true} 
                        style={{ height: "35px" }}
                      >
                        {badge.getExtraQuestionValue('Role/Title')}
                      </Textfit>}
                </div>
                <div className={`company-section ${showProfileLink && 'with-qr'}`}>
                  <Textfit 
                    mode={'multi'} 
                    max={17} 
                    className={`company ${showProfileLink ? 'with-qr' : ''}`} 
                    onInput={forceUpdate} 
                    contentEditable 
                    suppressContentEditableWarning={true} 
                    style={{ height: "35px" }}
                  >
                    {badge.getCompany()}
                  </Textfit>
                </div>
              </>
            }
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

