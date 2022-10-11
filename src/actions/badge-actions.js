import {
    getRequest,
    putRequest,
    createAction,
    stopLoading,
    startLoading,
    authErrorHandler,
} from "openstack-uicore-foundation/lib/utils/actions";
import {getAccessTokenSafely} from '../utils/utils';
import { exec } from "../services/wkbridge";

export const REQUEST_BADGE                        = 'REQUEST_BADGE';
export const BADGE_RECEIVED                       = 'BADGE_RECEIVED';
export const REQUEST_BADGE_PRINT_COUNT_INCREMENT  = 'REQUEST_BADGE_PRINT_COUNT_INCREMENT';
export const BADGE_PRINT_COUNT_INCREMENT_RECEIVED = 'BADGE_PRINT_COUNT_INCREMENT_RECEIVED';
export const PRINT_BADGE                          = 'PRINT_BADGE';
export const BADGE_PRINTED                        = 'BADGE_PRINTED';
export const CLEAR_BADGE                          = 'CLEAR_BADGE';

export const getBadge = (summitSlug, ticketId, { viewType = null } = {}) => async (dispatch, getState) => {
    const accessToken = await getAccessTokenSafely();
    const {baseState} = getState();
    const {summit} = baseState;

    if (!summit || !ticketId) throw Error();

    dispatch(startLoading());

    const params = {
        access_token: accessToken,
        expand: 'ticket, ticket.order, ticket.owner, ticket.owner.extra_questions, ticket.owner.extra_questions.question, ticket.owner.extra_questions.question.values, ticket.owner.member, features, type, type.access_levels, type.allowed_view_types'
    };

    const viewPath = viewType ? `/${viewType}` : '';

    return getRequest(
        createAction(REQUEST_BADGE),
        createAction(BADGE_RECEIVED),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets/${ticketId}/badge/current${viewPath}/print`,
        authErrorHandler,
        { viewType }
    )(params)(dispatch).then(() => 
        dispatch(stopLoading())
    );
};

export const incrementBadgePrintCount = (summitSlug, ticketId, { viewType = null, checkIn = true } = {}) => async (dispatch, getState) => {
    const {baseState} = getState();
    const {summit} = baseState;
    const viewPath = viewType ? `/${viewType}` : '';

    if (!summit || !ticketId) throw Error();

    const accessToken = await getAccessTokenSafely();

    const params = {
        access_token: accessToken
    };

    return putRequest(
        createAction(REQUEST_BADGE_PRINT_COUNT_INCREMENT),
        createAction(BADGE_PRINT_COUNT_INCREMENT_RECEIVED),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/tickets/${ticketId}/badge/current${viewPath}/print`,
        { check_in: checkIn },
        authErrorHandler
    )(params)(dispatch);
};

export const printBadge = (params) => (dispatch) => {

    return exec(
        createAction(PRINT_BADGE),
        createAction(BADGE_PRINTED),
        'print'
    )(params)(dispatch).then((payload) => {
        return payload.response.data;
    });
};

export const clearBadge = () => (dispatch) => Promise.resolve().then(() => {
    return dispatch(createAction(CLEAR_BADGE)({}));
});
