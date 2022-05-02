
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
    CLEAR_BADGE
} from "../actions/badge-actions";

import {
    REQUEST_TICKETS,
    RECEIVE_TICKETS,
    SET_SELECTED_TICKET,
    CLEAR_SELECTED_TICKET,
    TICKET_UPDATED
} from "../actions/ticket-actions";


const DEFAULT_STATE = {
    allSummits: [],
    allTickets: [],
    searchTerm: '',
    summit: null,
    badge: null,
    summitSlug: '',
    accessTokenQS: null,
    loading: 0,
    selectedTicket: null
}

const baseReducer = (state = DEFAULT_STATE, action) => {
    const { type, payload } = action

    switch(type){
        case LOGOUT_USER:
            return DEFAULT_STATE;
        case SET_ACCESS_TOKEN_QS:
            return { ...state, accessTokenQS: payload.accessToken };
        case START_LOADING:
            console.log('now loading');
            return { ...state, loading: 1 };
        case STOP_LOADING:
            console.log('stop loading');
            return { ...state, loading: 0 };
        case RECEIVE_SUMMITS:
            return { ...state, allSummits: payload.response.data };
        case RECEIVE_SUMMIT:
            return { ...state, summit: payload.response };
        case SET_SUMMIT:
            return { ...state, summit: payload.summit };
        case REQUEST_TICKETS:
            return { ...state, searchTerm: payload.search_term };
        case RECEIVE_TICKETS:
            return { ...state, allTickets: payload.response.data };
        case REQUEST_BADGE:
            const { summitSlug } = payload;
            return { ...state, summitSlug };
        case BADGE_RECEIVED:
            const badge = { ...payload.response };
            return { ...state, badge: badge };
        case CLEAR_BADGE:
            return {...state,
                selectedTicket: null,
                badge: null,
                searchTerm: '',
                allTickets: []
            };
        case SET_SELECTED_TICKET:
            return { ...state, selectedTicket: payload };
        case TICKET_UPDATED:
            return { ...state };
        case CLEAR_SELECTED_TICKET:
            return {
                ...state,
                selectedTicket: null,
                badge: null,
                searchTerm: '',
                allTickets: []
            }
        default:
            return state;
    }
}

export default baseReducer
