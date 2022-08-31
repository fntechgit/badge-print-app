import React, {
    useRef,
    useState,
    useLayoutEffect
} from 'react';
import { Textfit } from 'react-textfit';

import {
    BadgeTypes,
    BadgeTypesColor,
    ExtraQuestionsKeys,
    PronounsQuestionAnswers,
} from './utils/constants';

import {
    useForceUpdate
} from '@/utils/utils';

import {
    getIdFromUserProfileURL,
    getRobloxUsernameById
} from './utils/utils';

import './styles/card.less';

import background_img from './images/background94x140.png';
import info_img from './images/info94x140.png';

export default ({ badge }) => {
    const forceUpdate = useForceUpdate();
    const barRef = useRef(null);
    const [username, setUsername] = useState(null);
    useLayoutEffect(() => {
        const barColor = badge.getBadgeTypeName() == BadgeTypes.Staff ?
                            '#75787B' : BadgeTypesColor[badge.getBadgeTypeName()];
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
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard card">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
            <div 
                ref={barRef}
                className="bar"
            ></div>
            <div className="text-boxes">
                { username &&
                    <Textfit
                        mode="single"
                        max={50}
                        className="text-box user-name"
                        onInput={forceUpdate}
                        contentEditable
                        suppressContentEditableWarning={true}
                    >
                        {username}
                    </Textfit>
                }
                { !username && badge.getFirstName() &&
                    <Textfit
                        mode="single"
                        max={50}
                        className="text-box first-name"
                        onInput={forceUpdate}
                        contentEditable
                        suppressContentEditableWarning={true}
                    >
                        {badge.getFirstName()}
                    </Textfit>
                }
                { !username && badge.getLastName() &&
                    <Textfit
                        mode="single"
                        max={50}
                        className="text-box last-name"
                        onInput={forceUpdate}
                        contentEditable
                        suppressContentEditableWarning={true}
                    >
                        {badge.getLastName()}
                    </Textfit>
                }
                { pronouns &&
                    pronouns != PronounsQuestionAnswers.NotListedAbove &&
                    pronouns != PronounsQuestionAnswers.DontDisclose &&
                    <Textfit
                        mode="single"
                        max={16}
                        className="text-box pronounce"
                        onInput={forceUpdate}
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
                        onInput={forceUpdate}
                        contentEditable
                        suppressContentEditableWarning={true}
                    >
                        {badge.getCompany()}
                    </Textfit>
                }
                { badge.getFullName() &&
                    <Textfit
                        mode="single"
                        max={12}
                        className="text-box full-name"
                        onInput={forceUpdate}
                        contentEditable
                        suppressContentEditableWarning={true}
                    >
                        {badge.getFullName()}
                    </Textfit>
                }
                { badge.getFeature('Keynote Icon') &&
                    <img className="feature" src={badge.getFeature('Keynote Icon').image}/>
                }
                { badge.getFeature('Chaperone Icon') &&
                    <img className="feature" src={badge.getFeature('Chaperone Icon').image}/>
                }
            </div>
            <img className="bdg-image bdg-image-back" src={info_img}/>
        </div>
    </>
    );
}
