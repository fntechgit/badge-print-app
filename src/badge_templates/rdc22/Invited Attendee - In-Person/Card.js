import React, {
    useState,
    useStateuseEffect
} from 'react';

import { Textfit } from 'react-textfit';

import {
    ExtraQuestionsKeys,
    PronounsQuestionAnswers,
} from '../utils/constants';

import {
    useForceUpdate
} from '@/utils/utils';

import {
    getIdFromUserProfileURL,
    getRobloxUsernameById
} from '../utils/utils';

import '../styles/card.less';

import background_img from '../images/background92x140.png';
import info_img from '../images/info.png';

export default ({ badge }) => {
    const forceUpdate = useForceUpdate();
    const [username, setUsername] = useState(null);
    useEffect(() => {
        const usernameAnswer =
            badge.getExtraQuestionValue(ExtraQuestionsKeys.Username);
        const userId = !isNaN(usernameAnswer) ? usernameAnswer : getIdFromUserProfileURL(usernameAnswer);
        if (userId) {
            getRobloxUsernameById(userId)
                .then((payload) => setUsername(payload.displayName))
                .catch((e) => console.log(e));
        } else {
            setUsername(usernameAnswer);
        }
    }, []);
    const pronouns = badge.getExtraQuestionValue(ExtraQuestionsKeys.Pronouns);
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
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
                { pronouns &&
                    pronouns != PronounsQuestionAnswers.NotListedAbove &&
                    pronouns != PronounsQuestionAnswers.DontDisclose &&
                    <Textfit
                        mode="single"
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
                        className="text-box full-name"
                        onInput={forceUpdate}
                        contentEditable
                        suppressContentEditableWarning={true}
                    >
                        {badge.getFullName()}
                    </Textfit>
                }
            </div>
            <img className="bdg-image bdg-image-back" src={info_img}/>
        </div>
    </>
    );
}
