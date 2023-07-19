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

import logoBlack from './images/logo.svg';
import logoWhite from './images/logo-white.svg';
import meshBlack from './images/mesh.svg';
import meshWhite from './images/mesh-white.svg';

export default ({ badge }) => {
    const backgroundFillRef = useRef(null);
    const stripFillRef = useRef(null);
    const logoBackgroundFillRef = useRef(null);
    const artboardRef = useRef(null);
    const [username, setUsername] = useState(null);
    useLayoutEffect(() => {
        const backgroundColor = BadgeTypesColor[badge.getBadgeTypeName()];
        if (backgroundColor) {
            backgroundFillRef.current.style.setProperty('background-color', backgroundColor, 'important');
            logoBackgroundFillRef.current.style.setProperty('background-color', backgroundColor, 'important');
            stripFillRef.current.style.setProperty('background-color', backgroundColor, 'important');
            artboardRef.current.style.setProperty('background-color', backgroundColor);
        }
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
    const logo = badge.getBadgeTypeName() == BadgeTypes.Attendee ||
                 badge.getBadgeTypeName() == BadgeTypes.Press ?
                 logoBlack : logoWhite;
    const darkTheme = badge.getBadgeTypeName() == BadgeTypes.Staff ||
                 badge.getBadgeTypeName() == BadgeTypes.ExternalSpeaker ||
                 badge.getBadgeTypeName() == BadgeTypes.Guest;
    const over21 = badge.getExtraQuestionValue(ExtraQuestionsKeys.Over21) === "Yes";
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
                <div className="qrcode-box rotate-270">
                    { badge.getQRCode({ fgColor: '#100420', size: 78 }) }
                </div>
            }
            <div
                ref={logoBackgroundFillRef}
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
            { badge.getFirstName() &&
                <div
                    className={`name first-name text-vertical ${darkTheme ? 'white' : 'black'}`}
                    contentEditable>{badge.getFirstName()}
                </div>
            }
            { badge.getLastName() &&
                <div
                    className={`name last-name text-vertical ${darkTheme ? 'white' : 'black'}`}
                    contentEditable>{badge.getLastName()}
                </div>
            }
        </div>
    </>
    );
};
