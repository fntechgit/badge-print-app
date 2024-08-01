import React, {
    useRef,
    useState,
    useEffect,
    useLayoutEffect
} from 'react';
import { Textfit } from 'react-textfit';

import {
    BadgeTypes,
    WristbandBadgeTypesColor as BadgeTypesColor,
    ExtraQuestionsKeys,
} from './utils/constants';

import {
    getIdFromUserProfileURL,
    getRobloxUsernameById
} from './utils/utils';

import './styles/wristband.less';

import logoBlack from './images/wristbands/logo.svg';
import logoWhite from './images/wristbands/logo-white.svg';
import meshBlack from './images/wristbands/mesh.svg';
import meshWhite from './images/wristbands/mesh-white.svg';

export default ({ badge }) => {
    const backgroundFillRef = useRef(null);
    const stripFillRef = useRef(null);
    const artboardRef = useRef(null);
    const [username, setUsername] = useState(null);
    const logo = badge.getBadgeTypeName() == BadgeTypes.Attendee || badge.getBadgeTypeName() == BadgeTypes.Press ?
    logoBlack : logoWhite; 
    const darkTheme = badge.getBadgeTypeName() == BadgeTypes.Staff ||
                    badge.getBadgeTypeName() == BadgeTypes.Speaker ||
                    badge.getBadgeTypeName() == BadgeTypes.ExternalSpeaker ||
                    badge.getBadgeTypeName() == BadgeTypes.Guest; 
    const over21 = badge.getExtraQuestionValue(ExtraQuestionsKeys.Over21) === "Yes";
    const firstName = badge.getExtraQuestionValue(ExtraQuestionsKeys.FirstName);
    const lastName = badge.getExtraQuestionValue(ExtraQuestionsKeys.LastName);
    const usernameOnBadge = !!badge.getExtraQuestionValue(ExtraQuestionsKeys.UsernameOnBadge);
    useLayoutEffect(() => {
        const backgroundColor = BadgeTypesColor[badge.getBadgeTypeName()];
        if (backgroundColor) {
            backgroundFillRef.current.style.setProperty('background-color', backgroundColor, 'important');
            stripFillRef.current.style.setProperty('background-color', backgroundColor, 'important');
            artboardRef.current.style.setProperty('background-color', backgroundColor);
        }
        let usernameAnswer =
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

    return (
    <>
        <div id="badge-artboard" className="bdg-artboard wristband" ref={artboardRef}>
            <div
                ref={backgroundFillRef}
                className="background-fill"
            ></div>
            <div
                ref={stripFillRef}
                className="strip-fill"
            ></div>
            {!over21 &&
            <img className="mesh" src={darkTheme ? meshWhite : meshBlack}/>
            }
            { badge.hasQRCode() &&
                <div className={`qr-code-wrapper ${badge.getBadgeTypeName() == BadgeTypes.Attendee && 'black-border'}`}>
                    <div className="qrcode-box rotate-270">
                        { badge.getQRCode({ fgColor: '#100420', size: 78 }) }
                    </div>
                </div>
                
            }
            <div
                className="logo-fill rotate-270"
            >
                <img className="logo" src={logo}/>
            </div>
            { username &&
                <div
                    className={`user-name text-vertical ${darkTheme ? 'white' : 'black'}`}
                    contentEditable>{username}
                </div>
            }
            { firstName &&
                <div
                    className={`name first-name text-vertical ${darkTheme ? 'white' : 'black'}`}
                    contentEditable>{firstName}
                </div>
            }
            { !firstName && badge.getFirstName() &&
                <div
                    className={`name first-name text-vertical ${darkTheme ? 'white' : 'black'}`}
                    contentEditable>{badge.getFirstName()}
                </div>
            }
            { lastName &&
                <div
                    className={`name last-name text-vertical ${darkTheme ? 'white' : 'black'}`}
                    contentEditable>{lastName}
                </div>
            }
            { !lastName && badge.getLastName() &&
                <div
                    className={`name last-name text-vertical ${darkTheme ? 'white' : 'black'}`}
                    contentEditable>{lastName}
                </div>
            }
        </div>
    </>
    );
};
