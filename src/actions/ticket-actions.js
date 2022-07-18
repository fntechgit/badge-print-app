import Swal from "sweetalert2";

import {
    getRequest,
    putRequest,
    createAction,
    stopLoading,
    startLoading,
    getAccessToken,
    authErrorHandler,
    defaultErrorHandler
} from "openstack-uicore-foundation/lib/methods";

export const REQUEST_TICKET            = 'REQUEST_TICKET';
export const REQUEST_TICKETS           = 'REQUEST_TICKETS';
export const RECEIVE_TICKETS           = 'RECEIVE_TICKETS';
export const SET_SELECTED_TICKET       = 'SET_SELECTED_TICKET';
export const CLEAR_SELECTED_TICKET     = 'CLEAR_SELECTED_TICKET';
export const TICKET_UPDATED            = 'TICKET_UPDATED';

const DefaultPageSize = 100;

export const getTicket = (ticketId) => async (dispatch, getState) => {

    const accessToken = await getAccessToken();

    const { baseState: { summit } } = getState();

    dispatch(startLoading());

    const params = {
        access_token : accessToken,
        expand: 'badge, badge.features, promo_code, ticket_type, owner, owner.member, owner.extra_questions'
    };

    return getRequest(
        createAction(REQUEST_TICKET),
        createAction(SET_SELECTED_TICKET),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets/${ticketId}`,
        authErrorHandler,
        {search_term: ticketId}
    )(params)(dispatch).then((payload) => {
            let {response} = payload;
            dispatch(stopLoading());
            return response;
        }
    );
};

export const setSelectedTicket = (ticket) => (dispatch) => Promise.resolve().then(() => {
    return dispatch(createAction(SET_SELECTED_TICKET)(ticket));
})

export const clearSelectedTicket = () => (dispatch) => Promise.resolve().then(() => {
    return dispatch(createAction(CLEAR_SELECTED_TICKET)());
})

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
        expand       : 'owner,order,ticket_type,badge,badge.type,promo_code,owner.extra_questions'
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
        expand       : 'owner,order,ticket_type,badge,badge.type,promo_code,owner.extra_questions'
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

export const getAllTickets = ({
    filters = [],
    fields,
    expand,
    relations,
    order,
    page = 1,
    perPage = 5,
}) => async (dispatch, getState) => {

    let { baseState: { accessTokenQS: accessToken } } = getState();

    if (!accessToken) {
        accessToken = await getAccessToken();
    }

    dispatch(startLoading());

    const params = {
        access_token: accessToken,
        page: page,
        per_page: perPage,
    };

    if (filters) params['filter[]'] = filters;
    if (fields) params['fields'] = fields;
    if (expand) params['expand'] = expand;
    if (relations) params['relations'] = relations;
    if (order) params['order'] = order;
    
    const { baseState: { summit } } = getState();

    return getRequest(
        createAction(REQUEST_TICKETS),
        createAction(RECEIVE_TICKETS),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets`,
        defaultErrorHandler,
        { search_term: filters.toString() }
    )(params)(dispatch).then((payload) => {
        const { response: { last_page } } = payload;
        const allPages = Array.from({ length: last_page}, (_, i) => i + 1);
        const dispatchCalls = allPages.map(p =>
            dispatch(
                getTickets({ filters, fields, expand, relations, page: p, perPage, dispatchLoader: false })
            )
        );
        return Promise.all([...dispatchCalls]).then(allTickets => {
            dispatch(stopLoading());
            return allTickets.flat();
        }).catch(e => {
            dispatch(stopLoading())
            return Promise.reject(e);
        });
    }).catch(e => {
        dispatch(stopLoading())
        return Promise.reject(e);
    });
}

export const getTickets = ({
    filters = [],
    fields,
    expand,
    relations,
    order,
    page = 1,
    perPage = DefaultPageSize,
    dispatchLoader = true
}) => async (dispatch, getState) => {

    let { baseState: { accessTokenQS: accessToken } } = getState();

    if (!accessToken) {
        accessToken = await getAccessToken();
    }

    if (dispatchLoader) dispatch(startLoading());

    const params = {
        access_token: accessToken,
        page: page,
        per_page: perPage,
    };

    if (filters) params['filter[]'] = filters;
    if (fields) params['fields'] = fields;
    if (expand) params['expand'] = expand;
    if (relations) params['relations'] = relations;
    if (order) params['order'] = order;
    
    const { baseState: { summit } } = getState();

    return getRequest(
        createAction(REQUEST_TICKETS),
        createAction(RECEIVE_TICKETS),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets`,
        defaultErrorHandler,
        { search_term: filters.toString() }
    )(params)(dispatch).then((payload) => {
        const { data } = payload.response;
        if (dispatchLoader) dispatch(stopLoading());
        return data;
    }).catch(e => {
        if (dispatchLoader) dispatch(stopLoading())
        return Promise.reject(e);
    });
};

export const saveExtraQuestions = (extra_questions, owner, disclaimer) => async (dispatch, getState) => {

    const accessToken = await getAccessToken();

    const { baseState: { selectedTicket } } = getState();

    if (!selectedTicket) return Promise.fail();

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
        createAction(TICKET_UPDATED),
        `${window.API_BASE_URL}/api/v1/summits/all/orders/all/tickets/${selectedTicket.id}`,
        normalizedEntity,
        authErrorHandler
    )(params)(dispatch).then((payload) => {
        Swal.fire('Success', "Extra questions saved successfully", "success");
        dispatch(stopLoading());
        return payload;
    }).catch(e => {
        dispatch(stopLoading());
        Swal.fire('Error', "Error saving your questions. Please retry.", "warning");
        return (e);
    });
};