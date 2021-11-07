import React, { useState } from 'react';
import { connect } from 'react-redux';
import history from '../history';
import ExtraQuestions from '../components/extra-questions'
import { saveExtraQuestions, clearSelectedTicket } from '../actions/ticket-actions'
import styles from '../styles/extra-questions.module.scss'

export const ExtraQuestionsPage = ({summit, saveExtraQuestions, selectedTicket, clearSelectedTicket}) => {

	const extraQuestions = summit.order_extra_questions.sort((a, b) => (a.order > b.order) ? 1 : -1);
	const userAnswers = selectedTicket ? selectedTicket.owner.extra_questions : [];

	const [owner, setOwner] = useState({
			email: selectedTicket?.owner.email || '',
			first_name: selectedTicket?.owner.first_name || '',
			last_name: selectedTicket?.owner.last_name || '',
			company: selectedTicket?.owner.company || '',
	});

	// calculate state initial values
	const [disclaimer, setDisclaimer] = useState(selectedTicket?.owner?.disclaimer_accepted || false);
	const [answers, setAnswers] = useState(extraQuestions.map(question => {
			const userAnswer = userAnswers.filter(a => a.question_id === question.id);
			let newAnswer = { name: question.name, id: question.id, value: '' };
			if (userAnswer.length > 0) {
					newAnswer = { ...newAnswer, value: userAnswer[0].value };
			}
			return newAnswer
	}));

	const mandatoryQuestionsAnswered = () => {

			const mandatoryQuestions = extraQuestions.filter(question => question.mandatory === true);
			const mandatoryAnswers = mandatoryQuestions.every(question => {
					const answer = answers.find(a => a.id === question.id);
					return answer && answer.value;
			});

			if (summit.registration_disclaimer_mandatory) {
					return disclaimer && mandatoryAnswers;
			}

			return mandatoryAnswers;
	}

	const checkAttendeeInformation = () => {
			return !!owner.first_name && !!owner.last_name && !!owner.company && !!owner.email
	}

	const checkMandatoryDisclaimer = () => {
			return summit.registration_disclaimer_mandatory ? disclaimer : true;
	}

	const toggleDisclaimer = () => setDisclaimer(!disclaimer);

	const handleChange = (ev) => {
			let { value, id } = ev.target;

			if (ev.target.type === 'checkbox') {
					value = ev.target.checked ? "true" : "false";
			}

			if (ev.target.type === 'checkboxlist') {
					value = ev.target.value.join(',');
			}

			let newAnswer = answers.find(a => a.id === parseInt(id));
			newAnswer.value = value;

			setAnswers(answers => [...answers.filter(a => a.id !== parseInt(id)), newAnswer]);
	}

	const getAnswer = (question) => answers.find(a => a.id === question.id).value;

	if(!selectedTicket) return null;

	return (
		<>
				<div className="columns">
						<div className="column px-6 py-6 mb-6 is-half is-offset-one-quarter">
								<h2>Attendee Information</h2>
								<div className={styles.form}>
										<div className={`columns is-mobile ${styles.inputRow}`}>
												<div className='column is-one-third'>Ticket assigned to email</div>
												<div className='column is-two-thirds'>
														{owner.email}
												</div>
										</div>
										<div className={`columns is-mobile ${styles.inputRow}`}>
												<div className='column is-one-third'>First Name</div>
												<div className='column is-two-thirds'>
														{selectedTicket.owner.first_name ?
															selectedTicket.owner.first_name
																:
																<input
																		className={`${styles.input} ${styles.isMedium}`}
																		type="text"
																		placeholder="First Name"
																		onChange={e => setOwner({ ...owner, first_name: e.target.value })}
																		value={owner.first_name} />
														}
												</div>
										</div>
										<div className={`columns is-mobile ${styles.inputRow}`}>
												<div className='column is-one-third'>Last Name</div>
												<div className='column is-two-thirds'>
														{selectedTicket.owner.last_name ?
															selectedTicket.owner.last_name
																:
																<input
																		className={`${styles.input} ${styles.isMedium}`}
																		type="text"
																		placeholder="Last Name"
																		onChange={e => setOwner({ ...owner, last_name: e.target.value })}
																		value={owner.last_name} />
														}
												</div>
										</div>
										<div className={`columns is-mobile ${styles.inputRow}`}>
												<div className='column is-one-third'>Company</div>
												<div className='column is-two-thirds'>
														{selectedTicket.owner.company ?
															selectedTicket.owner.company
																:
																<input
																		className={`${styles.input} ${styles.isMedium}`}
																		type="text"
																		placeholder="Company"
																		onChange={e => setOwner({ ...owner, company: e.target.value })}
																		value={owner.company} />
														}
												</div>
										</div>
								</div>
								<h2>Additional Information</h2>
								<span>
										These extra questions are required before enter the event.
								</span>
								<div>
										{answers.length === extraQuestions.length && extraQuestions.map(question => {
												return <ExtraQuestions key={question.id} question={question} handleChange={handleChange} getAnswer={getAnswer} />
										})}
								</div>
								<div className={`columns ${styles.disclaimer}`}>
										<div className="column is-12">
												<input type="checkbox" checked={disclaimer} onChange={toggleDisclaimer} />
												<b>{summit.registration_disclaimer_mandatory ? '*' : ''}</b>
												<span dangerouslySetInnerHTML={{ __html: summit.registration_disclaimer_content }} />
										</div>
								</div>
								<button
										className={`${styles.buttonSave} button is-large`}
										disabled={
												!checkAttendeeInformation() ||
												!checkMandatoryDisclaimer() ||
												!mandatoryQuestionsAnswered()}
										onClick={() => saveExtraQuestions(answers, owner, disclaimer).then(() => {
											history.push(`/check-in/${summit.slug}/tickets/${selectedTicket.number}`)
										})}
								>
										Save and Continue
								</button>
								<button className={`${styles.buttonSave} button is-large`}
										onClick={() => clearSelectedTicket().then( () => {
											history.push(`/check-in/${summit.slug}/`)
										})}
								>Cancel</button>
						</div>
				</div>
		</>
	)
};


const mapStateToProps = ({ baseState }) => ({
	...baseState
});

export default connect(mapStateToProps, {
	saveExtraQuestions,
	clearSelectedTicket,
})(ExtraQuestionsPage)