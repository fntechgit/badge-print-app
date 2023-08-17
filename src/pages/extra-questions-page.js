import React, { useEffect, useState, useRef, useMemo } from "react";
import history from "../history";
import { connect } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import { getExtraQuestions } from "../actions/base-actions";
import { saveExtraQuestions, clearSelectedTicket } from "../actions/ticket-actions";
import Input  from "openstack-uicore-foundation/lib/components/inputs/text-input";
import RegistrationCompanyInput from "openstack-uicore-foundation/lib/components/inputs/registration-company-input";
import RawHTML from "openstack-uicore-foundation/lib/components/raw-html";
import QuestionsSet from "openstack-uicore-foundation/lib/utils/questions-set";
import ExtraQuestionsForm from "openstack-uicore-foundation/lib/components/extra-questions";

import styles from "../styles/extra-questions.module.scss";
import "../styles/extra-questions.less";

const noOpFn = () => {};

const scrollBehaviour = { behavior: "smooth", block: "start" };

const TicketKeys = {
  email: "attendee_email",
  firstName: "attendee_first_name",
  lastName: "attendee_last_name",
  company: "attendee_company",
  disclaimerAccepted: "disclaimer_accepted",
  extraQuestions: "extra_questions"
};

export const ExtraQuestionsPage = ({
  summit,
  ticket,
  extraQuestions,
  saveExtraQuestions,
  getExtraQuestions,
  clearSelectedTicket,
}) => {

  const formRef = useRef(null);
  const [triedSubmitting, setTriedSubmitting] = useState(false);

  useEffect(() => {
    if (ticket) getExtraQuestions(summit, ticket.owner.id);
  }, [ticket]);

  const initialValues = useMemo(() => {
    const {
      email,
      first_name,
      last_name,
      company,
      disclaimer_accepted_date,
      extra_questions
    } = ticket?.owner || {};

    const formattedExtraQuestions = extra_questions ?
      extra_questions.map(({ question_id, value }) => (
        { question_id: question_id, value }
      )) : [];

    return {
      [TicketKeys.email]: email,
      [TicketKeys.firstName]: first_name,
      [TicketKeys.lastName]: last_name,
      [TicketKeys.company]: { id: null, name: company },
      [TicketKeys.disclaimerAccepted]: !!disclaimer_accepted_date,
      [TicketKeys.extraQuestions]: formattedExtraQuestions
    };
  }, [ticket]);

  const validationSchema = useMemo(() => Yup.object().shape({
    [TicketKeys.firstName]: Yup.string().required(),
    [TicketKeys.lastName]: Yup.string().required(),
    [TicketKeys.company]: Yup.object().shape({
      id: Yup.number().nullable(),
      name: Yup.string().nullable().required(),
    }),
    ...(summit.registration_disclaimer_mandatory && {
      [TicketKeys.disclaimerAccepted]: Yup.boolean().oneOf([true]).required()
    })
  }), [ticket, summit]);

  const handleSubmit = (values, formikHelpers) => {
    formikHelpers.setSubmitting(true);
    saveExtraQuestions(values).then(() => {
      formikHelpers.setSubmitting(false);
      history.push(`/check-in/${summit.slug}/tickets/${ticket.id}`);
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
    // Note: We need `enableReinitialize` to be `true` so the extra questions aren"t cleared after saving.
    enableReinitialize: true
  });

  const scrollToError = (error) => document.querySelector(`label[for="${error}"]`).scrollIntoView(scrollBehaviour);

  const validateForm = (knownErrorRef = null) => {
    // Validate the formik form
    formik.validateForm().then((errors) => {
      const errorKeys = Object.keys(errors);
      // attendee data
      if (errorKeys.length > 0 && errorKeys[0] != TicketKeys.disclaimerAccepted) {
        scrollToError(errorKeys[0]);
        return;
      }
      // extra question
      if (knownErrorRef) {
        knownErrorRef.scrollIntoView(scrollBehaviour);
        return;
      }
      // disclaimer
      if (errorKeys.length > 0) {
        scrollToError(errorKeys[0]);
        return;
      }
      // submit the formik form
      formik.handleSubmit();
    });
  };

  const hasExtraQuestions = extraQuestions.length > 0;

  const triggerSubmit = () => {
    setTriedSubmitting(true);
    if (hasExtraQuestions) {
      // TODO: We shouldn"t have to do this to get the changes from the `ExtraQuestionsForm`.
      // We should just be able to pass an `onChange` event handler to the `ExtraQuestionsForm`.
      formRef.current.doSubmit();
      return;
    }
    validateForm();
  };

  const handleExtraQuestionError = (_, errorRef) => {
    validateForm(errorRef);
  }

  const onExtraQuestionsAnswersSet = (answersForm) => {
    const questionSet = new QuestionsSet(extraQuestions);
    const newAnswers = Object.keys(answersForm).reduce((acc, name) => {
      let question = questionSet.getQuestionByName(name);
      if (!question) {
        console.error(`Missing question for answer ${name}.`);
        return acc;
      }
      if (answersForm[name] || answersForm[name].length > 0) {
        acc.push({ question_id: question.id, answer: `${answersForm[name]}` });
      }
      return acc;
    }, []);
    // Set the extra question answers on the formik state.
    formik.setFieldValue(TicketKeys.extraQuestions, newAnswers);
    validateForm();
  };

  if (!ticket) {
    history.push(`/check-in/${summit.slug}`);
    return null;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <h2>Attendee Information</h2>
          <div className={`${styles.extraQuestion}`}>
            <label htmlFor={TicketKeys.firstName}>First Name</label>
            <Input
              id={TicketKeys.firstName}
              name={TicketKeys.firstName}
              className="form-control"
              type="text"
              placeholder={"Your First Name"}
              value={formik.values[TicketKeys.firstName]}
              onBlur={formik.handleBlur}
              onChange={!!initialValues[TicketKeys.firstName] ? noOpFn : formik.handleChange}
              disabled={!!initialValues[TicketKeys.firstName]}
            />
            {(formik.touched[TicketKeys.firstName] || triedSubmitting) && formik.errors[TicketKeys.firstName] &&
            <p className={styles.errorLabel}>Required</p>
            }
          </div>
          <div className={`${styles.extraQuestion}`}>
            <label htmlFor={TicketKeys.lastName}>Last Name</label>
            <Input
              id={TicketKeys.lastName}
              name={TicketKeys.lastName}
              className="form-control"
              type="text"
              placeholder={"Your Last Name"}
              value={formik.values[TicketKeys.lastName]}
              onBlur={formik.handleBlur}
              onChange={!!initialValues[TicketKeys.lastName] ? noOpFn : formik.handleChange}
              disabled={!!initialValues[TicketKeys.lastName]}
            />
            {(formik.touched[TicketKeys.lastName] || triedSubmitting) && formik.errors[TicketKeys.lastName] &&
            <p className={styles.errorLabel}>Required</p>
            }
          </div>
          <div className={`${styles.extraQuestion}`}>
            <label htmlFor={TicketKeys.email}>Email</label>
            <Input
              id={TicketKeys.email}
              name={TicketKeys.email}
              className="form-control"
              type="text"
              value={initialValues[TicketKeys.email]}
              disabled={true}
            />
          </div>
          <div className={`${styles.extraQuestion}`}>
            <label htmlFor={TicketKeys.company}>Company</label>
            <RegistrationCompanyInput
              id={TicketKeys.company}
              name={TicketKeys.company}
              summitId={summit.id}
              placeholder={"Your Company"}
              value={formik.values[TicketKeys.company]}
              onBlur={formik.handleBlur}
              onChange={!!initialValues[TicketKeys.company].name ? noOpFn : formik.handleChange}
              disabled={!!initialValues[TicketKeys.company].name}
              tabSelectsValue={false}
            />
            {(formik.touched[TicketKeys.company] || triedSubmitting) && formik.errors[TicketKeys.company] &&
            <p className={styles.errorLabel}>Required</p>
            }
          </div>
        </div>
      </div>
      { hasExtraQuestions &&
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <h2>Additional Information</h2>
          <p>Please answer these additional questions.</p>
          <ExtraQuestionsForm
            extraQuestions={extraQuestions}
            userAnswers={formik.values[TicketKeys.extraQuestions]}
            onAnswerChanges={onExtraQuestionsAnswersSet}
            ref={formRef}
            allowExtraQuestionsEdit={summit.allow_update_attendee_extra_questions}
            questionContainerClassName={styles.extraQuestion}
            //questionLabelContainerClassName={""}
            //questionControlContainerClassName={""}
            shouldScroll2FirstError={false}
            onError={handleExtraQuestionError}
          />
        </div>
      </div>
      }
      { summit.registration_disclaimer_content &&
      <div className="row">
        <div className={`col-md-8 col-md-offset-2 ${styles.extraQuestion} abc-checkbox`}>
          <input
            id={TicketKeys.disclaimerAccepted}
            name={TicketKeys.disclaimerAccepted}
            type="checkbox"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldTouched(TicketKeys.disclaimerAccepted, true) && formik.handleChange(e)
            }
            checked={formik.values[TicketKeys.disclaimerAccepted]}
          />
          <label htmlFor={TicketKeys.disclaimerAccepted}>
            {summit.registration_disclaimer_mandatory && <b>*</b>}
          </label>
          {(formik.touched[TicketKeys.disclaimerAccepted] || triedSubmitting) && formik.errors[TicketKeys.disclaimerAccepted] &&
          <p className={styles.errorLabel}>Required</p>
          }
          <div>
            <RawHTML>
              {summit.registration_disclaimer_content}
            </RawHTML>
          </div>
        </div>
      </div>
      }
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <button
            className={`${styles.buttonCancel} btn btn-primary`}
            onClick={() => clearSelectedTicket()}
          >
            Go Back
          </button>
          <button
            className={`${styles.buttonSave} btn btn-primary`}
            disabled={formik.isSubmitting}
            onClick={triggerSubmit}>
            {!formik.isSubmitting && <>Save and Continue</>}
            {formik.isSubmitting && <>Saving...</>}
          </button>
        </div>
      </div>
    </div>
  )
};

const mapStateToProps = ({ baseState }) => ({
  summit: baseState.summit,
  ticket: baseState.selectedTicket,
  extraQuestions: baseState.extraQuestions
});

export default connect(mapStateToProps, {
	getExtraQuestions,
	saveExtraQuestions,
	clearSelectedTicket,
})(ExtraQuestionsPage);
