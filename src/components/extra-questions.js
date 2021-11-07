import React from 'react'
import PropTypes from 'prop-types'
import { Input, Dropdown, RadioList, CheckboxList, RawHTML } from 'openstack-uicore-foundation/lib/components'

import styles from '../styles/extra-questions.module.scss'

const ExtraQuestions = ({ question, handleChange, getAnswer }) => {

    let questionValues = question.values;

    let htmlLabel = question.label;
    if (question.mandatory) {
        //Assuming that labels generated as html are wrapped in <p> bc the react-rte component generates them that way (defaultBlockTag: 'p')
        htmlLabel = htmlLabel?.endsWith('</p>') ? htmlLabel.replace(/<\/p>$/g, " <b>*</b></p>") : `${htmlLabel} <b>*</b>`;
    }

    switch (question.type) {
        case 'Text':
            return (
                <div key={question.id} className={`${styles.questionWrapper} row`}>
                    <div className="col-md-4"><RawHTML>{htmlLabel}</RawHTML></div>
                    <div className="col-md-8">
                        <Input
                            id={question.id}
                            value={getAnswer(question)}
                            onChange={handleChange}
                            placeholder={question.placeholder}
                            className="form-control"
                        />
                    </div>
                </div>
            );
        case 'TextArea':
            return (
                <div key={question.id} className={`${styles.questionWrapper} row`}>
                    <div className="col-md-4"><RawHTML>{htmlLabel}</RawHTML></div>
                    <div className="col-md-8">
                        <textarea
                            id={question.id}
                            value={getAnswer(question)}
                            onChange={handleChange}
                            placeholder={question.placeholder}
                            className="form-control"
                            rows="4"
                        />
                    </div>
                </div>
            );
        case 'CheckBox':
            return (
                <div key={question.id} className={`${styles.questionWrapper} row`}>
                    <div className="col-md-1">
                        <input type="checkbox" id={`${question.id}`} checked={(getAnswer(question) === "true")}
                            onChange={handleChange} />
                    </div>
                    <div className="col-md-11">
                        <RawHTML className={styles.questionCheckbox}>{htmlLabel}</RawHTML>
                    </div>
                </div>

            );
        case 'ComboBox':
            questionValues = questionValues.map(val => ({ ...val, value: val.id }));
            return (
                <div key={question.id} className={`${styles.questionWrapper} row`}>
                    <div className="col-md-4"><RawHTML>{htmlLabel}</RawHTML></div>
                    <div className="col-md-8">
                        <Dropdown
                            id={question.id}
                            overrideCSS={true}
                            value={getAnswer(question)}
                            options={questionValues}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            );
        case 'CheckBoxList':
            questionValues = questionValues.map(val => ({ ...val, value: val.id }));
            const answerValue = getAnswer(question) ? getAnswer(question).split(',').map(ansVal => parseInt(ansVal)) : [];
            return (
                <div key={question.id} className={`${styles.questionWrapper} row`}>
                    <div className="col-md-4"><RawHTML>{htmlLabel}</RawHTML></div>
                    <div className="col-md-8">
                        <CheckboxList
                            id={`${question.id}`}
                            value={answerValue}
                            options={questionValues}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            );
        case 'RadioButtonList':
            questionValues = questionValues.map(val => ({ ...val, value: val.id }));
            return (
                <div key={question.id} className={`${styles.questionWrapper} row`}>
                    <div className="col-md-4"><RawHTML>{htmlLabel}</RawHTML></div>
                    <div className="col-md-8">
                        <RadioList
                            id={`${question.id}`}
                            value={getAnswer(question)}
                            options={questionValues}
                            onChange={handleChange}
                            inline
                        />
                    </div>
                </div>
            );
        default:
            return null;
    }
};


ExtraQuestions.propTypes = {
    question: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    getAnswer: PropTypes.func.isRequired
};

export default ExtraQuestions