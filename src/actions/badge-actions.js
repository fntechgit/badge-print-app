import Swal from "sweetalert2";
import {
    getRequest,
    putRequest,
    createAction,
    stopLoading,
    startLoading,
    getAccessToken,
    authErrorHandler
} from "openstack-uicore-foundation/lib/methods";

import { exec } from "../services/wkbridge";

import { errorHandler } from './base-actions';

export const REQUEST_BADGE                        = 'REQUEST_BADGE';
export const BADGE_RECEIVED                       = 'BADGE_RECEIVED';
export const REQUEST_BADGE_PRINT_COUNT_INCREMENT  = 'REQUEST_BADGE_PRINT_COUNT_INCREMENT';
export const BADGE_PRINT_COUNT_INCREMENT_RECEIVED = 'BADGE_PRINT_COUNT_INCREMENT_RECEIVED';
export const PRINT_BADGE                          = 'PRINT_BADGE';
export const BADGE_PRINTED                        = 'BADGE_PRINTED';
export const CLEAR_BADGE                          = 'CLEAR_BADGE';

export const getBadge = (summitSlug, ticketId) => async (dispatch, getState) => {

    let { baseState } = getState();
    let accessToken = baseState.accessTokenQS;

    dispatch(startLoading());

    if (!accessToken) {
        accessToken = await getAccessToken();
        summitSlug = baseState.summit.slug;
    }

    let params = {
        access_token : accessToken,
        expand: 'ticket, ticket.order, ticket.owner, ticket.owner.member, features, type, type.access_levels'
    };

    if (!summitSlug || !ticketId || !accessToken) return;

    return getRequest(
        createAction(REQUEST_BADGE),
        createAction(BADGE_RECEIVED),
        `${window.API_BASE_URL}/api/v1/summits/${summitSlug}/tickets/${ticketId}/badge/current/print`,
        errorHandler,
        {summitSlug}
    )(params)(dispatch)
        .then((payload) => {
            dispatch(stopLoading());
        }
    );
};

export const incrementBadgePrintCount = (summitSlug, ticketId) => async (dispatch, getState) => {

    let { baseState } = getState();
    let accessToken = baseState.accessTokenQS;

    if (!accessToken) {
        accessToken = await getAccessToken();
        summitSlug = baseState.summit.slug;
    }

    let params = {
        access_token : accessToken
    };

    if (!summitSlug || !ticketId || !accessToken) return;

    return putRequest(
        createAction(REQUEST_BADGE_PRINT_COUNT_INCREMENT),
        createAction(BADGE_PRINT_COUNT_INCREMENT_RECEIVED),
        `${window.API_BASE_URL}/api/v1/summits/${summitSlug}/tickets/${ticketId}/badge/current/print`,
        {},
        errorHandler,
        {summitSlug}
    )(params)(dispatch)
        .then((payload) => {
        }
    );
};

export const printBadge = (params) => (dispatch) => {

    return exec(
        createAction(PRINT_BADGE),
        createAction(BADGE_PRINTED),
        'print'
    )(params)(dispatch).then((payload) => {
        let { data } = payload.response;
        return data;
    });
};


export const clearBadge = () => (dispatch) => {

    dispatch(createAction(CLEAR_BADGE)({}));
};
