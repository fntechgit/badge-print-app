import React, {
    useRef,
    useState,
    useLayoutEffect
} from 'react';
import { Textfit } from 'react-textfit';

import {
    BadgeTypes,
    BadgeTypesDisplayName,
    ZebraCardBadgeTypesColor as BadgeTypesColor,
    ExtraQuestionsKeys,
    PronounsQuestionAnswers,
} from './utils/constants';

import {
    getIdFromUserProfileURL,
    getRobloxUsernameById
} from './utils/utils';

import './styles/zebra-card.less';

import background_attendee from './images/badges/attendee.png';
import background_staff from './images/badges/staff.png';
import background_press from './images/badges/press.png';
import background_speaker_external from './images/badges/speaker_external.png';
import background_speaker_internal from './images/badges/speaker_internal.png';
import bug_keynote from './images/bug_keynote.png';
import bug_ria from './images/bug_ria.png';

const useForceUpdate = () => {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default ({ badge }) => {
    const forceUpdate = useForceUpdate();
    const barRef = useRef(null);
    const [username, setUsername] = useState(null);
    useLayoutEffect(() => {
        const barColor = BadgeTypesColor[badge.getBadgeTypeName()];
        if (barColor)
            barRef.current.style.setProperty('background-color', barColor, 'important');
        const usernameAnswer =
            badge.getExtraQuestionValue(ExtraQuestionsKeys.Username);
        if (badge.getBadgeTypeName() == BadgeTypes.Press || badge.getBadgeTypeName() == BadgeTypes.Guest) {
            setUsername(firstName); // display first name only if badge type is Press or RDC Guest
        } else {
            if (usernameAnswer && usernameAnswer.trim() !== '' &&
                usernameAnswer != 'N/A' && usernameAnswer != 'n/a') {
                // display username only if opted to in extra questions, otherwise - display first name
                setUsername(usernameOnBadge ? usernameAnswer : firstName);
            } else {
                const userIdAnswer =
                    badge.getExtraQuestionValue(ExtraQuestionsKeys.UserId);
                const userId = !isNaN(userIdAnswer) ? userIdAnswer : getIdFromUserProfileURL(userIdAnswer);
                if (userId) {
                    getRobloxUsernameById(userId)
                        .then((payload) => setUsername(payload.displayName))
                        .catch((e) => console.log(e));
                }
            }
        }
    }, []);
    const pronouns = badge.getExtraQuestionValue(ExtraQuestionsKeys.Pronouns);
    const darkTheme = badge.getBadgeTypeName() == BadgeTypes.Attendee || badge.getBadgeTypeName() == BadgeTypes.Press;
    let backgroundImage = background_attendee;
    switch (badge.getBadgeTypeName()) {
      case BadgeTypes.Staff:
        backgroundImage = background_staff;
        break;
      case BadgeTypes.Attendee:
        backgroundImage = background_attendee;
        break;
      case BadgeTypes.Press:
        backgroundImage = background_press;
        break;
      case BadgeTypes.Speaker:
        backgroundImage = background_speaker_internal;
        break;
      case BadgeTypes.ExternalSpeaker || BadgeTypes.Guest:
        backgroundImage = background_speaker_external;
        break;
    }
    const badgeTypeName = badge.getBadgeTypeName() == BadgeTypes.Staff &&
                          badge.getFeature("Speaker") ?
                          "Speaker" : BadgeTypesDisplayName[badge.getBadgeTypeName()];
    const usernameOnBadge = !!badge.getExtraQuestionValue(ExtraQuestionsKeys.UsernameOnBadge);
    const firstName = badge.getExtraQuestionValue(ExtraQuestionsKeys.FirstName);
    const badgeFeatures = badge.getAllFeatures();
    return (
        <div id="badge-artboard" className="bdg-artboard zebra-card">
            <img id="badge-artboard-img" className="bdg-image" src={backgroundImage}/>
            <div 
                ref={barRef}
                className="bar"
            >
                <span
                    className={`${darkTheme ? 'black' : 'white'}`}
                >
                    {badgeTypeName}
                </span>
            </div>
            <div className="badge-features">
                {badgeFeatures.length ?
                    <>
                        <div className="badge-feature keynote">
                            {badgeFeatures.find(bf => bf.name === "Keynote Backstage") && <img className="bug" src={bug_keynote} />}
                        </div>
                        <div className="badge-feature ria">
                            {badgeFeatures.find(bf => bf.name === "RIA Backstage") && <img className="bug" src={bug_ria} />}
                        </div>
                    </>
                    :
                    ""
                }
            </div>
            <div className="text-boxes">
                <Textfit
                    mode="multi"
                    min={25}
                    // max={32}
                    className="text-box user-name"
                    contentEditable
                    suppressContentEditableWarning={true}
                    onInput={forceUpdate} 
                >
                    {username}
                </Textfit>
                <Textfit
                    mode="single"
                    max={22}
                    className="text-box pronouns"
                    contentEditable
                    suppressContentEditableWarning={true}
                    onInput={forceUpdate} 
                >
                    {pronouns != PronounsQuestionAnswers.NotListedAbove &&
                    pronouns != PronounsQuestionAnswers.DontDisclose && pronouns}
                </Textfit>
                { badge.getCompany() &&
                    <Textfit
                        mode="single"
                        max={22}
                        className="text-box company"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onInput={forceUpdate}
                    >
                        {badge.getCompany()}
                    </Textfit>
                }
            </div>
        </div>
    );
}
