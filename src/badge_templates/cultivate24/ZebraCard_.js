import React, {
    useState,
    useLayoutEffect
} from 'react';
import { Textfit } from 'react-textfit';

import './styles/zebra-card.less';

import background_staff from './images/staff.png';
import background_attendee from './images/attendee.png';
import background_partner from './images/partner.png';

const BadgeTypes = {
    attendee: "General Attendee Badge",
    staff: "Staff/Employee Badge",
    partner: "Partner Badge",
};
const nameColor = {
    attendee: "#FFFFFF",
    other: "#003A49"
}
const companyColor = {
    attendee: "#6CCCE0",
    other: "#006680"
}

const useForceUpdate = () => {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default ({ badge }) => {
    const forceUpdate = useForceUpdate();
    const badgeType = badge.getBadgeTypeName();
    const [backgroundImg, setBackgroundImg] = useState(background_attendee);
    const [companyLineColor, setCompanyLineColor] = useState(companyColor.attendee);
    const [nameLineColor, setNameLineColor] = useState(nameColor.attendee);

    useLayoutEffect(() => {
        if (badgeType == null) return;
        switch (badgeType) {
        case BadgeTypes.attendee:
          setBackgroundImg(background_attendee);
          setCompanyLineColor(companyColor.attendee);
          setNameLineColor(nameColor.attendee);
          break;
        case BadgeTypes.staff:
          setBackgroundImg(background_staff);
          setCompanyLineColor(companyColor.other);
          setNameLineColor(nameColor.other);
          break;
        case BadgeTypes.partner: 
          setBackgroundImg(background_partner);
          setCompanyLineColor(companyColor.other);
          setNameLineColor(nameColor.other);
          break;
        }
      }, [badgeType]);
    return (
        <div id="badge-artboard" className="bdg-artboard card zebra-card">
            <img id="badge-artboard-img" className="bdg-image bdg-image-front" src={backgroundImg}/>
            <div className="text-box">
                <div className="first-name-wrapper name-wrapper">
                    <Textfit mode="single" max={42} onInput={forceUpdate} className="first-name name" contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                </div>
                <div className="last-name-wrapper name-wrapper">
                    <Textfit mode="single" max={35} onInput={forceUpdate} className="last-name name" contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>               
                </div>       
            </div>
            <div className="company-section">
                <Textfit 
                    mode="single" 
                    max={20} 
                    className="company"
                    onInput={forceUpdate} 
                    contentEditable 
                    suppressContentEditableWarning={true} 
                    style={{ color: companyLineColor }}
                >
                {badge.getCompany()}
                </Textfit>
            </div>
        </div>
    );
}
