import Swal from "sweetalert2";
import {
    getRequest,
    putRequest,
    postRequest,
    deleteRequest,
    createAction,
    stopLoading,
    startLoading,
    showMessage,
} from "openstack-uicore-foundation/lib/methods";


export const REQUEST_BADGE       = 'REQUEST_BADGE';
export const BADGE_RECEIVED      = 'BADGE_RECEIVED';
export const BADGE_PRINTED       = 'BADGE_PRINTED';


export const getBadge = () => (dispatch, getState) => {

    dispatch(stopLoading());
    dispatch(createAction(REQUEST_BADGE));

    return;

    let params = {
        access_token : accessToken,
        expand: 'summit,track_groups'
    };

    dispatch(startLoading());

    return getRequest(
        createAction(REQUEST_BADGE),
        createAction(BADGE_RECEIVED),
        `${window.API_BASE_URL}/api/v1/summits/all/selection-plans/current/submission`,
        selectionPlanErrorHandler
    )(params)(dispatch)
        .then((payload) => {
            dispatch(stopLoading());
        }
    );
};



