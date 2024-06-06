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

/**
 * @param summitId
 * @param perPage
 * @returns {(function(*): (Promise<never>))|*}
 */
export const getMarketingSettings = (summitId, perPage = 100) => (dispatch) => {

    dispatch(startLoading());

    if(!summitId) return Promise.reject();

    let params = {
        page: 1,
        per_page: perPage,
    };

    // get first page
    const endpoint = `${window.MARKETING_API_BASE_URL}/api/public/v1/config-values/all/shows/${summitId}`
    return getRequest(
      createAction('DUMMY'),
      createAction('DUMMY'),
      endpoint,
      authErrorHandler
    )(params)(dispatch).then((payload) => {
        const { response } = payload;
        const { total, per_page, data: initial_data} = response;
        // then do a promise all to get remaining ones
        const totalPages = Math.ceil(total / per_page);
        if(totalPages === 1) {
            // we have only one page ...
            dispatch(createAction(RECEIVE_MARKETING_SETTINGS)(initial_data));
            dispatch(stopLoading());
            return;
        }
        // only continue if totalPages > 1
        let params = Array.from({length: totalPages}, (_, i) => {
              return {
                  page: i + 1,
                  per_page: per_page,
              };
          }
        )
        // get remaining ones
        Promise.all(params.map(p =>
          getRequest(
            createAction('DUMMY'),
            createAction('DUMMY'),
            endpoint,
            authErrorHandler
          )(p)(dispatch)
        ))
          .then((responses) => {
              let marketingSettings = [];
              responses?.forEach(e => marketingSettings.push(...e?.response?.data));
              marketingSettings = [...initial_data, ...marketingSettings];
              dispatch(createAction(RECEIVE_MARKETING_SETTINGS)(marketingSettings));
              dispatch(stopLoading());
          })
          .catch(err => {
              dispatch(stopLoading());
              return Promise.reject(e);
          });
    }).catch(e => {
        dispatch(stopLoading());
        return Promise.reject(e);
    });
  };
