import React, { useEffect, useState, useRef, useMemo } from 'react';
import { connect } from 'react-redux';
import history from '../history';
import { Redirect } from 'react-router-dom';
import QuestionsSet from 'openstack-uicore-foundation/lib/utils/questions-set';
import { ExtraQuestionsForm } from 'openstack-uicore-foundation/lib/components';
import { getExtraQuestions } from '../actions/base-actions';
import { saveExtraQuestions, clearSelectedTicket } from '../actions/ticket-actions';
import styles from '../styles/extra-questions.module.scss';

export const ExtraQuestionsPage = ({
	summit,
	getExtraQuestions,
	extraQuestions,
	saveExtraQuestions,
	selectedTicket,
	clearSelectedTicket
}) => {

	const formRef = useRef(null);

	useEffect(() => {
		getExtraQuestions(summit);
	}, []);

	const userAnswers = selectedTicket ? selectedTicket.owner.extra_questions : [];

	const [owner, setOwner] = useState({
			email: selectedTicket?.owner?.email || '',
			first_name: selectedTicket?.owner?.first_name || '',
			last_name: selectedTicket?.owner?.last_name || '',
			company: selectedTicket?.owner?.company || '',
			disclaimer: selectedTicket?.owner?.disclaimer_accepted || false,
	});

	// calculate state initial values
	const [answers, setAnswers] = useState([]);

	const checkAttendeeInformation = () =>
		!!owner.first_name && !!owner.last_name && !!owner.company && !!owner.email;

	const checkMandatoryDisclaimer = () =>
			summit.registration_disclaimer_mandatory ? owner.disclaimer : true;

	const disabledButton = useMemo(() => !checkAttendeeInformation() || !checkMandatoryDisclaimer(),
				[owner.first_name, owner.last_name, owner.company, owner.email, owner.disclaimer]);

	const toggleDisclaimer = () => setOwner({ ...owner, disclaimer: !owner.disclaimer });

	const goToPrintBadge = () =>
		history.push(`/check-in/${summit.slug}/tickets/${selectedTicket.number}`);

	const handleAnswerChanges = (answersForm) => {
			const qs = new QuestionsSet(extraQuestions);
			let newAnswers = [];
			Object.keys(answersForm).forEach(name => {
					let question = qs.getQuestionByName(name);
					if (!question){
							console.log(`missing question for answer ${name}.`);
							return;
					}
					newAnswers.push({ id: question.id, value: answersForm[name]});
			});
			setAnswers(newAnswers);
			saveExtraQuestions(newAnswers, owner).then(goToPrintBadge);
	};

	const getAnswer = (question) => answers.find(a => a.id === question.id).value;

	const triggerFormSubmit = () => {
    if (extraQuestions.length > 0) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      return;
    }
    saveExtraQuestions([], owner).then(goToPrintBadge);
  }

	if (!selectedTicket) return <Redirect to={`/check-in/${summit.slug}/`} />;;

	return (
		<>
				<div className="container">
						<div className="col-md-8 col-md-offset-2">
								<h3>Attendee Information</h3>
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
												{ selectedTicket.owner.first_name ?
													selectedTicket.owner.first_name
													:
													<input
														className={`${styles.inputField}`}
														type="text"
														placeholder="First Name"
														onChange={e => setOwner({ ...owner, first_name: e.target.value })}
														value={owner.first_name}
													/>
												}
												</div>
										</div>
										<div className={`row ${styles.inputRow}`}>
												<div className='col-md-4'>Last Name *</div>
												<div className='col-md-8'>
												{ selectedTicket.owner.last_name ?
													selectedTicket.owner.last_name
													:
													<input
														className={`${styles.inputField}`}
														type="text"
														placeholder="Last Name"
														onChange={e => setOwner({ ...owner, last_name: e.target.value })}
														value={owner.last_name}
													/>
												}
												</div>
										</div>
										<div className={`row ${styles.inputRow}`}>
												<div className='col-md-4'>Company *</div>
												<div className='col-md-8'>
														{ selectedTicket.owner.company ?
															selectedTicket.owner.company
															:
															<input
																className={`${styles.inputField}`}
																type="text"
																placeholder="Company"
																onChange={e => setOwner({ ...owner, company: e.target.value })}
																value={owner.company}
															/>
														}
												</div>
										</div>
								</div>
								{ extraQuestions.length > 0 &&
									<>
										<h3>Additional Information</h3>
										<h5>
												These extra questions are required before entering the event.
										</h5>
										<div>
											<ExtraQuestionsForm
												ref={formRef}
											  className={styles.form}
												extraQuestions={extraQuestions}
												userAnswers={userAnswers}
												onAnswerChanges={handleAnswerChanges}
												questionContainerClassName={`row ${styles.inputRow}`}
												questionLabelContainerClassName={'col-md-4'}
												questionControlContainerClassName={`col-md-8 ${styles.inputField}`}
											/>
										</div>
									</>
								}
								{ summit?.registration_disclaimer_content &&
								<div className={`row ${styles.disclaimer}`}>
									<div className="col-md-12">
										<input type="checkbox" checked={owner.disclaimer} onChange={toggleDisclaimer} />
										<b>{summit.registration_disclaimer_mandatory ? '*' : ''}</b>
										<span dangerouslySetInnerHTML={{ __html: summit.registration_disclaimer_content }} />
									</div>
								</div>
								}
								<div className="row">
									<div className="col-md-12 text-center">
										<button
											className={`${styles.buttonSave} btn btn-primary`}
											onClick={() => clearSelectedTicket().then(() =>
												history.push(`/check-in/${summit.slug}/`)
											)}
										>
											Cancel
										</button>
										<button
											className={`${styles.buttonSave} btn btn-primary`}
											disabled={disabledButton}
											onClick={() => triggerFormSubmit()}
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
	getExtraQuestions,
	saveExtraQuestions,
	clearSelectedTicket,
})(ExtraQuestionsPage)