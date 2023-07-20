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

import background1_img from './images/background1-89x142,2.png';
import background2_img from './images/background2-89x142,2.png';
import background3_img from './images/background3-89x142,2.png';
import background4_img from './images/background4-89x142,2.png';

export default ({ badge }) => {
    const barRef = useRef(null);
    const [username, setUsername] = useState(null);
    useLayoutEffect(() => {
        const barColor = BadgeTypesColor[badge.getBadgeTypeName()];
        if (barColor)
            barRef.current.style.setProperty('background-color', barColor, 'important');
        const usernameAnswer =
            badge.getExtraQuestionValue(ExtraQuestionsKeys.Username);
        if (usernameAnswer && usernameAnswer.trim() !== '' &&
            usernameAnswer != 'N/A' && usernameAnswer != 'n/a') {
            setUsername(usernameAnswer);
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
    }, []);
    const pronouns = badge.getExtraQuestionValue(ExtraQuestionsKeys.Pronouns);
    const darkTheme = badge.getBadgeTypeName() == BadgeTypes.Attendee ||
                      badge.getBadgeTypeName() == BadgeTypes.Speaker ||
                      badge.getBadgeTypeName() == BadgeTypes.Volunteer ||
                      badge.getBadgeTypeName() == BadgeTypes.Press;
    let backgroundImage = background3_img;
    switch (badge.getBadgeTypeName()) {
      case BadgeTypes.Staff:
        backgroundImage = background1_img;
        break;
      case BadgeTypes.Attendee:
        backgroundImage = background2_img;
        break;
      case BadgeTypes.Press:
        backgroundImage = background4_img;
        break;
    }
    const badgeTypeName = badge.getBadgeTypeName() == BadgeTypes.Staff &&
                          badge.getFeature("Speaker") ?
                          "Speaker" : BadgeTypesDisplayName[badge.getBadgeTypeName()];
    const usernameOnBadge = !!badge.getExtraQuestionValue(ExtraQuestionsKeys.UsernameOnBadge);
    const firstName = badge.getExtraQuestionValue(ExtraQuestionsKeys.FirstName);
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
            <div className="text-boxes">
                { usernameOnBadge && username && 
                    <Textfit
                        mode="single"
                        max={34}
                        className="text-box user-name"
                        onReady={() => window.dispatchEvent(new CustomEvent('resize'))}
                        contentEditable
                        suppressContentEditableWarning={true}
                    >
                        {username}
                    </Textfit>
                }
                { !usernameOnBadge &&
                    <Textfit
                        mode="single"
                        max={34}
                        className="text-box first-name"
                        onReady={() => window.dispatchEvent(new CustomEvent('resize'))}
                        contentEditable
                        suppressContentEditableWarning={true}
                    >
                        {firstName}
                    </Textfit>
                }
                { pronouns &&
                  pronouns != PronounsQuestionAnswers.NotListedAbove &&
                  pronouns != PronounsQuestionAnswers.DontDisclose &&
                    <Textfit
                        mode="single"
                        max={22}
                        className="text-box pronounce"
                        onReady={() => window.dispatchEvent(new CustomEvent('resize'))}
                        contentEditable
                        suppressContentEditableWarning={true}
                    >
                        {pronouns}
                    </Textfit>
                }
                { badge.getCompany() &&
                    <Textfit
                        mode="single"
                        max={22}
                        className="text-box company"
                        onReady={() => window.dispatchEvent(new CustomEvent('resize'))}
                        contentEditable
                        suppressContentEditableWarning={true}
                    >
                        {badge.getCompany()}
                    </Textfit>
                }
            </div>
        </div>
    );
}
