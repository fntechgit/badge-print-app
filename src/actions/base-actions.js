import Swal from "sweetalert2";
import {
    putRequest,
    createAction,
    stopLoading,
    startLoading,
    showMessage
} from "openstack-uicore-foundation/lib/methods";

export const REQUEST_BADGE       = 'REQUEST_BADGE';
export const BADGE_RECEIVED      = 'BADGE_RECEIVED';
export const BADGE_PRINTED       = 'BADGE_PRINTED';
export const CLEAR_BADGE         = 'CLEAR_BADGE';
export const UPDATE_SIZE         = 'UPDATE_SIZE';


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
}

export const getBadge = (summitId, ticketId, accessToken) => (dispatch, getState) => {

    let params = {
        access_token : accessToken,
        expand: 'ticket, ticket.order, ticket.owner, ticket.owner.member, features, type, type.access_levels'
    };

    if (!summitId || !ticketId || !accessToken) return;

    dispatch(startLoading());

    return putRequest(
        createAction(REQUEST_BADGE),
        createAction(BADGE_RECEIVED),
        `${window.API_BASE_URL}/api/v1/summits/${summitId}/tickets/${ticketId}/badge/current/print`,
        errorHandler
    )(params)(dispatch)
        .then((payload) => {
            dispatch(stopLoading());
        }
    );
};

export const clearBadge = () => (dispatch) => {

    dispatch(createAction(CLEAR_BADGE)({}));

};

export const changeSize = (size) => (dispatch) => {

    dispatch(createAction(UPDATE_SIZE)({size}));

};
