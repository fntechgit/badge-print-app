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
				<div className="container">
						<div className="col-md-8 col-md-offset-2">
								<h2>Attendee Information</h2>
								<div className={styles.form}>
										<div className={`row ${styles.inputRow}`}>
												<div className='col-md-4'>Ticket assigned to email</div>
												<div className='col-md-8'>
														{owner.email}
												</div>
										</div>
										<div className={`row ${styles.inputRow}`}>
												<div className='col-md-4'>First Name *</div>
												<div className='col-md-8'>
														{selectedTicket.owner.first_name ?
															selectedTicket.owner.first_name
																:
																<input
																		className={`form-control ${styles.input} ${styles.isMedium}`}
																		type="text"
																		placeholder="First Name"
																		onChange={e => setOwner({ ...owner, first_name: e.target.value })}
																		value={owner.first_name} />
														}
												</div>
										</div>
										<div className={`row ${styles.inputRow}`}>
												<div className='col-md-4'>Last Name *</div>
												<div className='col-md-8'>
														{selectedTicket.owner.last_name ?
															selectedTicket.owner.last_name
																:
																<input
																		className={`form-control`}
																		type="text"
																		placeholder="Last Name"
																		onChange={e => setOwner({ ...owner, last_name: e.target.value })}
																		value={owner.last_name} />
														}
												</div>
										</div>
										<div className={`row ${styles.inputRow}`}>
												<div className='col-md-4'>Company *</div>
												<div className='col-md-8'>
														{selectedTicket.owner.company ?
															selectedTicket.owner.company
																:
																<input
																		className={`form-control`}
																		type="text"
																		placeholder="Company"
																		onChange={e => setOwner({ ...owner, company: e.target.value })}
																		value={owner.company} />
														}
												</div>
										</div>
								</div>
								<h2>Additional Information</h2>
								<h5>
										These extra questions are required before entering the event.
								</h5>
								<div>
										{answers.length === extraQuestions.length && extraQuestions.map(question => {
												return <ExtraQuestions key={question.id} question={question} handleChange={handleChange} getAnswer={getAnswer} />
										})}
								</div>
								<div className={`row ${styles.disclaimer}`}>
										<div className="col-md-12">
												<input type="checkbox" checked={disclaimer} onChange={toggleDisclaimer} />
												<b>{summit.registration_disclaimer_mandatory ? '*' : ''}</b>
												<span dangerouslySetInnerHTML={{ __html: summit.registration_disclaimer_content }} />
										</div>
								</div>
								<div className="row">
										<div className="col-md-12 text-center">
											<button className={`${styles.buttonSave} btn btn-primary`}
													onClick={() => clearSelectedTicket().then( () => {
														history.push(`/check-in/${summit.slug}/`)
													})}
											>Cancel</button>
											<button
													className={`${styles.buttonSave} btn btn-primary`}
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
										</div>
								</div>
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