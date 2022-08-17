import React, {
    useRef,
    useState,
    useEffect,
    useLayoutEffect
} from 'react';
import { Textfit } from 'react-textfit';

import {
    useForceUpdate
} from '@/utils/utils';

import {
    BadgeTypes,
    BadgeTypesColor,
    ExtraQuestionsKeys,
} from './utils/constants';

import {
    getIdFromUserProfileURL
} from './utils/utils';

import './styles/wristband.less';

import logoBlack from './images/logo.svg';
import logoWhite from './images/logo-white.svg';

export default ({ badge }) => {
    const forceUpdate = useForceUpdate();
    const backgroundFillRef = useRef(null);
    const stripFillRef = useRef(null);
    const artboardRef = useRef(null);
    const [userName, setUserName] = useState(null);
    useLayoutEffect(() => {
        const backgroundColor = BadgeTypesColor[badge.getBadgeTypeName()];
        if (backgroundColor) {
            backgroundFillRef.current.style.setProperty('background-color', backgroundColor, 'important');
            stripFillRef.current.style.setProperty('background-color', backgroundColor, 'important');
            artboardRef.current.style.setProperty('background-color', backgroundColor);
        }
        const usernameAnswer =
            badge.getExtraQuestionValue(ExtraQuestionsKeys.Username);
        const userId = !isNaN(usernameAnswer) ? usernameAnswer : getIdFromUserProfileURL(usernameAnswer);
        if (userId) {
            fetch(`https://users.roproxy.com/v1/users/${userId}`)
                .then((response) => response.json())
                .then((data) => setUserName(data.displayName))
                .catch((e) => console.log(e));
        } else {
            setUserName(usernameAnswer);
        }
    }, []);
    const darkTheme = badge.getBadgeTypeName() == BadgeTypes.Attendee ||
                        badge.getBadgeTypeName() == BadgeTypes.Press;
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard" ref={artboardRef}>
            <div
                ref={backgroundFillRef}
                className="background-fill"
            ></div>
            <div
                ref={stripFillRef}
                className="strip-fill"
            ></div>
            { badge.hasQRCode() &&
                <div className="qrcode-box rotate-270">
                    { badge.getQRCode({ fgColor: '#101820', size: 69 }) }
                </div>
            }
            <img className="logo white rotate-270" src={darkTheme ? logoBlack : logoWhite}/>
            { userName &&
                <div
                    className={`user-name text-vertical ${darkTheme ? 'black-6c' : 'white'}`}
                    contentEditable>{userName}
                </div>
            }
            { badge.getFirstName() &&
                <div
                    className={`name first-name text-vertical ${darkTheme ? 'black-6c' : 'white'}`}
                    contentEditable>{badge.getFirstName()}
                </div>
            }
            { badge.getLastName() &&
                <div
                    className={`name last-name text-vertical ${darkTheme ? 'black-6c' : 'white'}`}
                    contentEditable>{badge.getLastName()}
                </div>
            }
        </div>
    </>
    );
};
