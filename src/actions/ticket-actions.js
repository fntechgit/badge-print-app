import Swal from "sweetalert2";
import {
    getRequest,
    putRequest,
    createAction,
    stopLoading,
    startLoading,
    authErrorHandler
} from "openstack-uicore-foundation/lib/utils/actions";
import { Base64 } from 'js-base64';
import { getAccessTokenSafely } from "../utils/utils";
import {
  handleAuthAlert,
  withAlertHandler,
  alertErrorAndRethrow,
  alertNetworkOrServerErrorAndRethrow
} from "../utils/errorHandling";

export const REQUEST_TICKET            = "REQUEST_TICKET";
export const RECEIVE_TICKET            = "RECEIVE_TICKET";
export const REQUEST_TICKETS           = "REQUEST_TICKETS";
export const RECEIVE_TICKETS           = "RECEIVE_TICKETS";
export const SET_SELECTED_TICKET       = "SET_SELECTED_TICKET";
export const CLEAR_SELECTED_TICKET     = "CLEAR_SELECTED_TICKET";
export const TICKET_UPDATED            = "TICKET_UPDATED";

const DefaultPageSize = 50;

export const findTicketByQRCode = (qrCode) => async (dispatch, getState) => {

    const { baseState } = getState();
    const { summit, accessTokenQS } = baseState;
    const accessToken = await getAccessTokenSafely(accessTokenQS);

    dispatch(startLoading());

    const params = {
        access_token : accessToken,
        expand: "badge, badge.features, promo_code, ticket_type, owner, owner.member, owner.extra_questions"
    };

    let encodedQRCode = Base64.encode(qrCode);

    return getRequest(
        createAction(REQUEST_TICKET),
        createAction(RECEIVE_TICKET),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets/${encodedQRCode}`,
        withAlertHandler(authErrorHandler, handleAuthAlert)
    )(params)(dispatch)
        .then((payload) => payload.response)
        .catch(alertNetworkOrServerErrorAndRethrow)
        .finally(() => dispatch(stopLoading()));
};

export const setSelectedTicket = (ticket) => (dispatch) => Promise.resolve().then(() => {
    return dispatch(createAction(SET_SELECTED_TICKET)(ticket));
})

export const clearSelectedTicket = () => (dispatch) => Promise.resolve().then(() => {
    return dispatch(createAction(CLEAR_SELECTED_TICKET)());
})

export const findTicketsByName = (firstName, lastName) => async (dispatch, getState) => {
    const { baseState: { summit, accessTokenQS } } = getState();
    const accessToken = await getAccessTokenSafely(accessTokenQS);

    dispatch(startLoading());

    const name = `${firstName} ${lastName}`;

    const params = {
        access_token : accessToken,
        page         : 1,
        per_page     : DefaultPageSize,
        "filter[]"   : [`owner_name==${name}`,`is_active==1`,`access_level_type_name==IN_PERSON`],
        expand       : "owner,order,ticket_type,badge,badge.type,promo_code,owner.extra_questions"
    };

    return getRequest(
        createAction(REQUEST_TICKETS),
        createAction(RECEIVE_TICKETS),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets`,
        withAlertHandler(authErrorHandler, handleAuthAlert),
        { search_term: name }
    )(params)(dispatch)
        .then((payload) => payload.response.data)
        .catch(alertNetworkOrServerErrorAndRethrow)
        .finally(() => dispatch(stopLoading()));
};

export const findTicketsByEmail = (email) => async (dispatch, getState) => {
    const { baseState: { summit, accessTokenQS } } = getState();
    const accessToken = await getAccessTokenSafely(accessTokenQS);

    dispatch(startLoading());

    const params = {
        access_token : accessToken,
        page         : 1,
        per_page     : DefaultPageSize,
        "filter[]"   : [`owner_email==${email}`,`is_active==1`,`access_level_type_name==IN_PERSON`],
        expand       : "owner,order,ticket_type,badge,badge.type,promo_code,owner.extra_questions"
    };

    return getRequest(
        createAction(REQUEST_TICKETS),
        createAction(RECEIVE_TICKETS),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets`,
        withAlertHandler(authErrorHandler, handleAuthAlert),
        { search_term: email }
    )(params)(dispatch)
        .then((payload) => payload.response.data)
        .catch(alertNetworkOrServerErrorAndRethrow)
        .finally(() => dispatch(stopLoading()));
};

export const findExternalTicketsByEmail = (email) => async (dispatch, getState) => {
    const { baseState: { summit, accessTokenQS } } = getState();
    const accessToken = await getAccessTokenSafely(accessTokenQS);

    dispatch(startLoading());

    const params = {
        access_token : accessToken,
        page         : 1,
        per_page     : DefaultPageSize,
        "filter[]"   : [`owner_email==${email}`],
        expand       : "owner,order,ticket_type,badge,badge.type,promo_code,owner.extra_questions"
    };

    return getRequest(
        createAction(REQUEST_TICKETS),
        createAction(RECEIVE_TICKETS),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets/external`,
        withAlertHandler(authErrorHandler, handleAuthAlert),
        { search_term: email }
    )(params)(dispatch)
        .then((payload) => payload.response.data)
        .catch(alertNetworkOrServerErrorAndRethrow)
        .finally(() => dispatch(stopLoading()));
};
export const getAllTickets = ({
    filters = [],
    fields,
    expand,
    relations,
    order,
    page = 1,
    perPage = DefaultPageSize,
}) => async (dispatch, getState) => {
    const { baseState: { summit, accessTokenQS } } = getState();
    const accessToken = await getAccessTokenSafely(accessTokenQS);

    dispatch(startLoading());

    const params = {
        access_token: accessToken,
        page: page,
        per_page: perPage,
    };

    if (filters) params["filter[]"] = filters;
    if (fields) params["fields"] = fields;
    if (expand) params["expand"] = expand;
    if (relations) params["relations"] = relations;
    if (order) params["order"] = order;

    try {
        const payload = await getRequest(
            createAction(REQUEST_TICKETS),
            createAction(RECEIVE_TICKETS),
            `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets`,
            authErrorHandler,
            { search_term: filters.toString() }
        )(params)(dispatch);

        const { response: { last_page } } = payload;
        const allPages = Array.from({ length: last_page}, (_, i) => i + 1);

        let allTickets = [];

        for (const p of allPages) {
            const ticketsPage = await dispatch(
                getTickets(
                    { filters, fields, expand, relations, page: p, perPage, order },
                    { dispatchLoader: false }
                )
            );
            allTickets = [...allTickets, ...ticketsPage];
        }

        dispatch(stopLoading());
        return allTickets;
    } catch (e) {
        dispatch(stopLoading());
        return Promise.reject(e);
    }
};


export const getTickets = ({
    filters = [],
    fields,
    expand,
    relations,
    order,
    page = 1,
    perPage = DefaultPageSize,
}, { dispatchLoader = true }) => async (dispatch, getState) => {
    const { baseState: { summit, accessTokenQS } } = getState();
    const accessToken = await getAccessTokenSafely(accessTokenQS);

    if (dispatchLoader) dispatch(startLoading());

    const params = {
        access_token: accessToken,
        page: page,
        per_page: perPage,
    };

    if (filters) params["filter[]"] = filters;
    if (fields) params["fields"] = fields;
    if (expand) params["expand"] = expand;
    if (relations) params["relations"] = relations;
    if (order) params["order"] = order;

    return getRequest(
        createAction(REQUEST_TICKETS),
        createAction(RECEIVE_TICKETS),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets`,
        authErrorHandler,
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

export const saveExtraQuestions = (values) => async (dispatch, getState) => {
    const { baseState: { selectedTicket, accessTokenQS } } = getState();
    const accessToken = await getAccessTokenSafely(accessTokenQS);

    const normalizedEntity = {...values};
    if (!values.attendee_company.id) {
        normalizedEntity["attendee_company"] = values.attendee_company.name;
    } else {
        delete(normalizedEntity["attendee_company"]);
        normalizedEntity["attendee_company_id"] = values.attendee_company.id;
    }

    const params = {
        access_token: accessToken,
        expand: "owner, owner.extra_questions"
    };

    dispatch(startLoading());
    return putRequest(
        null,
        createAction(TICKET_UPDATED),
        `${window.API_BASE_URL}/api/v1/summits/all/orders/all/tickets/${selectedTicket.id}`,
        normalizedEntity,
        authErrorHandler
    )(params)(dispatch).then((payload) => {
        dispatch(stopLoading());
        return payload;
    }).catch(e => {
        dispatch(stopLoading());
        Swal.fire("Error", "Error saving your questions. Please retry.", "warning");
        return Promise.reject(e);
    });
};
