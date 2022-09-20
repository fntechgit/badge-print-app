import Swal from "sweetalert2";
import {
    getRequest,
    createAction,
    stopLoading,
    startLoading,
    showMessage,
    getAccessToken,
    clearAccessToken,
    authErrorHandler
} from "openstack-uicore-foundation/lib/methods";
import T from "i18n-react/dist/i18n-react";

export const REQUEST_SUMMITS     = 'REQUEST_SUMMITS';
export const RECEIVE_SUMMITS     = 'RECEIVE_SUMMITS';
export const SET_SUMMIT          = 'SET_SUMMIT';
export const REQUEST_SUMMIT      = 'REQUEST_SUMMIT';
export const RECEIVE_SUMMIT      = 'RECEIVE_SUMMIT';
export const SET_ACCESS_TOKEN_QS = 'SET_ACCESS_TOKEN_QS';
export const GET_EXTRA_QUESTIONS = 'GET_EXTRA_QUESTIONS';

export const setAccessTokenQS = (accessToken) => (dispatch) => {
    dispatch(createAction(SET_ACCESS_TOKEN_QS)({accessToken}));
};

export const loadSummits = () => async (dispatch, getState) => {

    let accessToken;
    try {
        accessToken = await getAccessToken();
    } catch (e) {
        console.log(e);
    }

    dispatch(startLoading());

    let params = {
        access_token : accessToken,
        expand: 'order_extra_questions,order_extra_questions.values',
        relations: 'order_extra_questions',
        page: 1,
        per_page: 100,
    };

    return getRequest(
        createAction(REQUEST_SUMMITS),
        createAction(RECEIVE_SUMMITS),
        `${window.API_BASE_URL}/api/v1/summits/all`,
        authErrorHandler
    )(params)(dispatch).then(() => 
        dispatch(stopLoading())
    );
};

export const setSummit = (summit) => (dispatch, getState) => {
    dispatch(createAction(SET_SUMMIT)({summit}));
};

export const getSummit = (summitSlug) => async (dispatch, getState) => {

    let { baseState: { accessTokenQS: accessToken } } = getState();

    try {
        accessToken = await getAccessToken();
    } catch (e) {
        console.log(e);
    }

    dispatch(startLoading());

    const params = {
        access_token: accessToken,
        expand: 'order_extra_questions,order_extra_questions.values',
    };

    return getRequest(
        createAction(REQUEST_SUMMIT),
        createAction(RECEIVE_SUMMIT),
        `${window.API_BASE_URL}/api/v1/summits/all/${summitSlug}`,
        authErrorHandler
    )(params)(dispatch).then(() =>
        dispatch(stopLoading())
    );
};

export const getExtraQuestions = (summit) => async (dispatch, getState) => {

    let { baseState: { accessTokenQS: accessToken } } = getState();

    try {
        accessToken = await getAccessToken();
    } catch (e) {
        console.log(e);
    }

    dispatch(startLoading());

    const params = {
        access_token: accessToken,
        'filter[]': ['class==MainQuestion', 'usage==Ticket'],
        expand: '*sub_question_rules,*sub_question,*values',
        order: 'order',
        page: 1,
        per_page: 100,
    };

    return getRequest(
        null,
        createAction(GET_EXTRA_QUESTIONS),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/order-extra-questions`,
        authErrorHandler
    )(params)(dispatch).then(() => {
        dispatch(stopLoading());
    }).catch(e => {
        console.log('ERROR: ', e);
        clearAccessToken();
        dispatch(stopLoading());
        return Promise.reject(e);
    });
}