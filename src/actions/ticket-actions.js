import T from "i18n-react/dist/i18n-react";

import {
    getRequest,
    putRequest,
    createAction,
    stopLoading,
    startLoading,
    showMessage,
    getAccessToken,
    authErrorHandler
} from "openstack-uicore-foundation/lib/methods";

export const REQUEST_TICKET         = 'REQUEST_TICKET';
export const RECEIVE_TICKET         = 'RECEIVE_TICKET';
export const REQUEST_TICKETS        = 'REQUEST_TICKETS';
export const RECEIVE_TICKETS        = 'RECEIVE_TICKETS';

export const getTicket = (ticketId) => async (dispatch, getState) => {

    const accessToken = await getAccessToken();

    const { baseState: { summit } } = getState();

    dispatch(startLoading());

    const params = {
        access_token : accessToken,
        expand: 'badge, badge.features, promo_code, ticket_type, owner, owner.member'
    };

    return getRequest(
        createAction(REQUEST_TICKET),
        createAction(RECEIVE_TICKET),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets/${ticketId}`,
        authErrorHandler,
        {search_term: ticketId}
    )(params)(dispatch).then((data) => {
            dispatch(stopLoading());
        }
    );
};


export const findTicketsByName = (firstName, lastName) => async (dispatch, getState) => {

    const accessToken = await getAccessToken();

    const { baseState: { summit } } = getState();

    dispatch(startLoading());

    const name = `${firstName} ${lastName}`;

    const params = {
        access_token : accessToken,
        page         : 1,
        per_page     : 20,
        'filter[]'   : [`owner_name=@${name}`,`is_active==1`,`access_level_type_name==IN_PERSON`],
        expand       : 'owner,order,ticket_type,badge,badge.type,promo_code'
    };

    return getRequest(
        createAction(REQUEST_TICKETS),
        createAction(RECEIVE_TICKETS),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets`,
        authErrorHandler,
        {search_term: name}
    )(params)(dispatch).then((payload) => {
        let {data} = payload.response;
        dispatch(stopLoading());
        return data;
    });
};

export const findTicketsByEmail = (email) => async (dispatch, getState) => {

    const accessToken = await getAccessToken();

    const { baseState: { summit } } = getState();

    dispatch(startLoading());

    const params = {
        access_token : accessToken,
        page         : 1,
        per_page     : 20,
        'filter[]'   : [`owner_email==${email}`,`is_active==1`,`access_level_type_name==IN_PERSON`],
        expand       : 'owner,order,ticket_type,badge,badge.type,promo_code'
    };

    return getRequest(
        createAction(REQUEST_TICKETS),
        createAction(RECEIVE_TICKETS),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets`,
        authErrorHandler,
        {search_term: email}
    )(params)(dispatch).then((payload) => {
        let {data} = payload.response;
        dispatch(stopLoading());
        return data;
    });
};


export const saveExtraQuestions = (extra_questions, owner, disclaimer) => async (dispatch, getState) => {

    const accessToken = await getAccessToken();

    const { baseState: { allTickets } } = getState();

    const extraQuestionsAnswers = extra_questions.map(q => {
        return { question_id: q.id, answer: `${q.value}` }
    })

    const normalizedEntity = {
        attendee_email: owner.email,
        attendee_first_name: owner.first_name,
        attendee_last_name: owner.last_name,
        attendee_company: owner.company,
        disclaimer_accepted: disclaimer,
        extra_questions: extraQuestionsAnswers
    };

    dispatch(startLoading());

    const params = {
        access_token: accessToken,
        expand: 'owner, owner.extra_questions'
    };

    return putRequest(
        null,
        null,
        `${window.API_BASE_URL}/api/v1/summits/all/orders/all/tickets/${allTickets[0].id}`,
        normalizedEntity,
        authErrorHandler
    )(params)(dispatch).then(() => {
        //Swal.fire('Success', "Extra questions saved successfully", "success");
    }).catch(e => {
        dispatch(stopLoading());
        //Swal.fire('Error', "Error saving your questions. Please retry.", "warning");
        return (e);
    });
};
