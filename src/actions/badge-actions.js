import Swal from "sweetalert2";
import {
    putRequest,
    createAction,
    stopLoading,
    startLoading,
    authErrorHandler
} from "openstack-uicore-foundation/lib/methods";

import { errorHandler } from './base-actions';

export const REQUEST_BADGE       = 'REQUEST_BADGE';
export const BADGE_RECEIVED      = 'BADGE_RECEIVED';
export const BADGE_PRINTED       = 'BADGE_PRINTED';
export const CLEAR_BADGE         = 'CLEAR_BADGE';

export const getBadge = (summitSlug, ticketId) => (dispatch, getState) => {

    let { loggedUserState, baseState } = getState();
    let accessToken = baseState.accessTokenQS;

    dispatch(startLoading());

    if (!accessToken) {
        accessToken = loggedUserState.accessToken;
        summitSlug = baseState.summit.slug;
    }

    let params = {
        access_token : accessToken,
        expand: 'ticket, ticket.order, ticket.owner, ticket.owner.member, features, type, type.access_levels'
    };

    if (!summitSlug || !ticketId || !accessToken) return;

    return putRequest(
        createAction(REQUEST_BADGE),
        createAction(BADGE_RECEIVED),
        `${window.API_BASE_URL}/api/v1/summits/${summitSlug}/tickets/${ticketId}/badge/current/print`,
        {},
        errorHandler,
        {summitSlug}
    )(params)(dispatch)
        .then((payload) => {
            dispatch(stopLoading());
        }
    );
};

export const clearBadge = () => (dispatch) => {

    dispatch(createAction(CLEAR_BADGE)({}));

};
