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

export const REQUEST_TICKETS     = 'REQUEST_TICKETS';
export const RECEIVE_TICKETS     = 'RECEIVE_TICKETS';
export const REQUEST_TICKET      = 'REQUEST_TICKET';
export const RECEIVE_TICKET      = 'RECEIVE_TICKET';

export const getTicket = (ticketId) => async (dispatch, getState) => {

    const accessToken = await getAccessToken();

    let { baseState } = getState();
    let { summit }   = baseState;

    dispatch(startLoading());

    let params = {
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

    let { baseState } = getState();
    let { summit } = baseState;

    let name = `${firstName} ${lastName}`;

    dispatch(startLoading());

    let params = {
        access_token : accessToken,
        page         : 1,
        per_page     : 20,
        'filter[]'   : [`owner_name==${name}`,`is_active==1`,`access_level_type_name==IN_PERSON`],
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

    let { baseState } = getState();
    let { summit } = baseState;

    dispatch(startLoading());

    let params = {
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
