import Swal from "sweetalert2";
import {
    getRequest,
    putRequest,
    createAction,
    stopLoading,
    startLoading,
    showMessage,
    authErrorHandler
} from "openstack-uicore-foundation/lib/methods";

export const REQUEST_TICKETS     = 'REQUEST_TICKETS';
export const RECEIVE_TICKETS     = 'RECEIVE_TICKETS';
export const REQUEST_TICKET      = 'REQUEST_TICKET';
export const RECEIVE_TICKET      = 'RECEIVE_TICKET';

export const getTicket = (ticketId) => (dispatch, getState) => {

    let { loggedUserState, baseState } = getState();
    let { accessToken }     = loggedUserState;
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
        authErrorHandler
    )(params)(dispatch).then((data) => {
            dispatch(stopLoading());
        }
    );
};


export const findTicketsByName = (firstName, lastName) => (dispatch, getState) => {

    let { loggedUserState, baseState } = getState();
    let { accessToken } = loggedUserState;
    let { summit }      = baseState;

    dispatch(startLoading());

    let params = {
        access_token : accessToken,
        page         : 1,
        per_page     : 20,
        'filter[]'   : [`owner_name==${firstName} ${lastName}`],
        expand       : 'owner,order,ticket_type,badge,promo_code'
    };

    return getRequest(
        createAction(REQUEST_TICKETS),
        createAction(RECEIVE_TICKETS),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets`,
        authErrorHandler
    )(params)(dispatch).then((data) => {
            dispatch(stopLoading());
            if (data.response.length > 0) {
                return data.response[0];
            }
        }
    );
};

export const findTicketsByEmail = (email) => (dispatch, getState) => {

    let { loggedUserState, baseState } = getState();
    let { accessToken } = loggedUserState;
    let { summit }      = baseState;

    dispatch(startLoading());

    let params = {
        access_token : accessToken,
        page         : 1,
        per_page     : 20,
        'filter[]'   : [`owner_email==${email}`],
        expand       : 'owner,order,ticket_type,badge,promo_code'
    };

    return getRequest(
        createAction(REQUEST_TICKETS),
        createAction(RECEIVE_TICKETS),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets`,
        authErrorHandler
    )(params)(dispatch).then((data) => {
            dispatch(stopLoading());
            if (data.response.length > 0) {
                return data.response[0];
            }
        }
    );
};
