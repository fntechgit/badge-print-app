
import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";
import {
    RECEIVE_SUMMITS,
    RECEIVE_SUMMIT,
    SET_SUMMIT,
    SET_ACCESS_TOKEN_QS
} from "../actions/base-actions";

import {
    REQUEST_BADGE,
    BADGE_RECEIVED,
    BADGE_PRINTED,
    CLEAR_BADGE
} from "../actions/badge-actions";

import {
    REQUEST_TICKETS,
    RECEIVE_TICKETS
} from "../actions/ticket-actions";

import {
    REQUEST_QRCODE,
    RECEIVE_QRCODE
} from "../actions/qrcode-actions";

const DEFAULT_STATE = {
    allSummits: [],
    allTickets: [],
    searchTerm: '',
    summit: null,
    badge: null,
    summitSlug: '',
    accessTokenQS: null,
    loading: 0,
}

const baseReducer = (state = DEFAULT_STATE, action) => {
    const { type, payload } = action

    switch(type){
        case LOGOUT_USER: {
            return DEFAULT_STATE;
        }
        break;
        case SET_ACCESS_TOKEN_QS: {
            return {...state, accessTokenQS: payload.accessToken};
        }
        break;
        case START_LOADING:
            console.log('now loading');
            return {...state, loading: 1};
        break;
        case STOP_LOADING:
            console.log('stop loading');
            return {...state, loading: 0};
        break;
        case RECEIVE_SUMMITS: {
            return {...state, allSummits: payload.response.data};
        }
        break;
        case RECEIVE_SUMMIT: {
            return {...state, summit: payload.response};
        }
        break;
        case SET_SUMMIT: {
            return {...state, summit: payload.summit};
        }
        break;
        case REQUEST_TICKETS: {
            return {...state, searchTerm: payload.search_term};
        }
        break;
        case RECEIVE_TICKETS: {
            return {...state, allTickets: payload.response.data};
        }
        break;
        case REQUEST_BADGE: {
            let { summitSlug } = payload;
            return {...state, summitSlug};
        }
        break;
        case BADGE_RECEIVED: {
            let badge = {...payload.response};
            return {...state, badge: badge};
        }
        break;
        case CLEAR_BADGE: {
            return {...state,
                badge: null,
                searchTerm:'',
                allTickets: [],
            };
        }
        break;
        default:
            return state;
        break;
    }
}

export default baseReducer
