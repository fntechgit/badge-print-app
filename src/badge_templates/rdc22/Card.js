import React, { useRef, useLayoutEffect } from 'react';
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

import './styles/card.less';

import background_img from './images/background92x140.png';
import info_img from './images/info.png';

export default ({ badge }) => {
    const forceUpdate = useForceUpdate();
    const barRef = useRef(null);
    useLayoutEffect(() => {
        const barColor = badge.getBadgeTypeName() == BadgeTypes.Staff ?
                            '#75787B' : BadgeTypesColor[badge.getBadgeTypeName()];
            barRef.current.style.setProperty('background-color', barColor, 'important');
    }, []);
    const pronouns = badge.getExtraQuestionValue(ExtraQuestionsKeys.Pronouns);
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
            <div 
                ref={barRef}
                className="bar"
            ></div>
            <div className="text-boxes">
                { badge.getFirstName() &&
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
                { badge.getLastName() &&
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
