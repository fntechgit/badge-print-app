import {
    getRequest,
    createAction,
    stopLoading,
    startLoading,
    authErrorHandler
} from "openstack-uicore-foundation/lib/utils/actions";
import { clearAccessToken } from "openstack-uicore-foundation/lib/security/methods";

import {getAccessTokenSafely} from '../utils/utils';


export const REQUEST_SUMMITS     = 'REQUEST_SUMMITS';
export const RECEIVE_SUMMITS     = 'RECEIVE_SUMMITS';
export const SET_SUMMIT          = 'SET_SUMMIT';
export const CLEAR_SUMMIT        = 'CLEAR_SUMMIT';
export const REQUEST_SUMMIT      = 'REQUEST_SUMMIT';
export const RECEIVE_SUMMIT      = 'RECEIVE_SUMMIT';
export const SET_ACCESS_TOKEN_QS = 'SET_ACCESS_TOKEN_QS';
export const GET_EXTRA_QUESTIONS = 'GET_EXTRA_QUESTIONS';
export const REQUEST_MARKETING_SETTINGS = 'REQUEST_MARKETING_SETTINGS';
export const RECEIVE_MARKETING_SETTINGS = 'RECEIVE_MARKETING_SETTINGS';

export const setAccessTokenQS = (accessToken) => (dispatch) => {
    dispatch(createAction(SET_ACCESS_TOKEN_QS)({accessToken}));
};

export const loadSummits = () => async (dispatch, getState) => {
    const { baseState: { accessTokenQS } } = getState();
    const accessToken = await getAccessTokenSafely(accessTokenQS);

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

export const clearSummit = () => (dispatch) => {
    dispatch(createAction(CLEAR_SUMMIT)({}));
}

export const getSummit = (summitSlug) => async (dispatch, getState) => {
    const { baseState: { accessTokenQS } } = getState();
    const accessToken = await getAccessTokenSafely(accessTokenQS);

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
    )(params)(dispatch).then(({response: summit}) => {
        dispatch(stopLoading())
        return summit;
    }
    );
};

export const getExtraQuestions = (summit, attendeeId) => async (dispatch, getState) => {
    const { baseState: { accessTokenQS } } = getState();
    const accessToken = await getAccessTokenSafely(accessTokenQS);

    dispatch(startLoading());

    const params = {
        access_token: accessToken,
        expand: '*sub_question_rules,*sub_question,*values',
        order: 'order',
        page: 1,
        per_page: 100,
    };

    return getRequest(
        null,
        createAction(GET_EXTRA_QUESTIONS),
        `${window.API_BASE_URL}/api/v1/summits/${summit.id}/attendees/${attendeeId}/allowed-extra-questions`,        
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

export const getMarketingSettings = (summitId) => (dispatch) => {

    dispatch(startLoading());

    if(!summitId) return Promise.reject();

    let params = {
      per_page: 100,
      page: 1
    };
  
    return getRequest(
      createAction(REQUEST_MARKETING_SETTINGS),
      createAction(RECEIVE_MARKETING_SETTINGS),
      `${window.MARKETING_API_BASE_URL}/api/public/v1/config-values/all/shows/${summitId}`,
      authErrorHandler
    )(params)(dispatch).then(() => {
        dispatch(stopLoading());
    }).catch(e => {
        console.log('ERROR: ', e);
        dispatch(stopLoading());
        return Promise.reject(e);
    });
  };