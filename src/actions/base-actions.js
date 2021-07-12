import Swal from "sweetalert2";
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
import T from "i18n-react/dist/i18n-react";

export const REQUEST_SUMMITS     = 'REQUEST_SUMMITS';
export const RECEIVE_SUMMITS     = 'RECEIVE_SUMMITS';
export const SET_SUMMIT          = 'SET_SUMMIT';
export const REQUEST_SUMMIT      = 'REQUEST_SUMMIT';
export const RECEIVE_SUMMIT      = 'RECEIVE_SUMMIT';
export const SET_ACCESS_TOKEN_QS = 'SET_ACCESS_TOKEN_QS';

export const setAccessTokenQS = (accessToken) => (dispatch) => {
    dispatch(createAction(SET_ACCESS_TOKEN_QS)({accessToken}));
};

export const loadSummits = () => async (dispatch, getState) => {

    const accessToken = await getAccessToken();

    dispatch(startLoading());

    let params = {
        access_token : accessToken,
        expand: 'none',
        relations: 'none',
        page: 1,
        per_page: 100,
    };

    getRequest(
        createAction(REQUEST_SUMMITS),
        createAction(RECEIVE_SUMMITS),
        `${window.API_BASE_URL}/api/v1/summits/all`,
        authErrorHandler
    )(params)(dispatch, getState).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const setSummit = (summit) => (dispatch, getState) => {
    dispatch(createAction(SET_SUMMIT)({summit}));
};

export const getSummit = (summitSlug) => async (dispatch, getState) => {

    let { baseState } = getState();
    let accessToken = baseState.accessTokenQS;

    if (!accessToken) {
        accessToken = await getAccessToken();
    }

    dispatch(startLoading());

    let params = {
        access_token : accessToken,
    };

    return getRequest(
        createAction(REQUEST_SUMMIT),
        createAction(RECEIVE_SUMMIT),
        `${window.API_BASE_URL}/api/v1/summits/all/${summitSlug}`,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const errorHandler = (err, res) => (dispatch, state) => {
    let code = err.status;
    let msg = '';

    dispatch(stopLoading());

    switch (code) {
        case 401:
        case 403:
            let error_message = {
                title: 'ERROR',
                html: "Access Token Expired. Go back to the app and try printing again.",
                type: 'error'
            };

            dispatch(showMessage( error_message ));
            break;
        case 404:
            msg = "";

            if (err.response.body && err.response.body.message) msg = err.response.body.message;
            else if (err.response.error && err.response.error.message) msg = err.response.error.message;
            else msg = err.message;

            Swal.fire("Not Found", msg, "warning");

            break;
        case 412:
            for (var [key, value] of Object.entries(err.response.body.errors)) {
                if (isNaN(key)) {
                    msg += key + ': ';
                }

                msg += value + '<br>';
            }
            Swal.fire("Validation error", msg, "warning");
            dispatch({
                type: VALIDATE,
                payload: {errors: err.response.body.errors}
            });
            break;
        default:
            Swal.fire("ERROR", T.translate("errors.server_error"), "error");
    }
};
