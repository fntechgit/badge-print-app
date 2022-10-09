
import {
    START_LOADING,
    STOP_LOADING,
    LOGOUT_USER,
    RECEIVE_USER_INFO
} from "openstack-uicore-foundation/lib/actions";

import {
    RECEIVE_SUMMITS,
    RECEIVE_SUMMIT,
    SET_SUMMIT,
    SET_ACCESS_TOKEN_QS,
    GET_EXTRA_QUESTIONS,
} from "../actions/base-actions";

import {
    REQUEST_BADGE,
    BADGE_RECEIVED,
    CLEAR_BADGE,
} from "../actions/badge-actions";

import {
    REQUEST_TICKETS,
    RECEIVE_TICKETS,
    SET_SELECTED_TICKET,
    CLEAR_SELECTED_TICKET,
    TICKET_UPDATED,
} from "../actions/ticket-actions";


const DEFAULT_STATE = {
    allSummits: [],
    allTickets: [],
    searchTerm: '',
    summit: null,
    extraQuestions: [],
    badge: null,
    badgeViewType: null,
    accessTokenQS: null,
    loading: false,
    selectedTicket: null,
    userIsAdmin: false
}

const baseReducer = (state = DEFAULT_STATE, action) => {
    const { type, payload } = action

    switch(type){
        case RECEIVE_USER_INFO: {
            const { response } = payload;
            const userGroups = response.groups.map((group) => group.title);
            const adminGroups = ['super-admins', 'administrators'];
            const userIsAdmin = userGroups.some(v => adminGroups.includes(v));
            return { ...state, userIsAdmin };
        };
        case LOGOUT_USER:
            return DEFAULT_STATE;
        case SET_ACCESS_TOKEN_QS:
            return { ...state, accessTokenQS: payload.accessToken };
        case START_LOADING:
            console.log('now loading');
            return { ...state, loading: true };
        case STOP_LOADING:
            console.log('stop loading');
            return { ...state, loading: false };
        case RECEIVE_SUMMITS:
            return { ...state, allSummits: payload.response.data };
        case RECEIVE_SUMMIT:
            return { ...state, summit: payload.response };
        case SET_SUMMIT:
            return { ...state, summit: payload.summit };
        case REQUEST_TICKETS:
            return { ...state, searchTerm: payload.search_term };
        case RECEIVE_TICKETS:
            const newAllTickets = [...state.allTickets];
            newAllTickets.push(...payload.response.data);
            return { ...state, allTickets: newAllTickets };
        case REQUEST_BADGE:
            const { viewType } = payload;
            return { ...state, badgeViewType: viewType };
        case BADGE_RECEIVED:
            const badge = { ...payload.response };
            return { ...state, badge };
        case CLEAR_BADGE:
            return {...state,
                selectedTicket: null,
                badge: null,
                badgeViewType: null,
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
        case GET_EXTRA_QUESTIONS: {
              const extraQuestions = payload.response.data;
              return { ...state, loading: false, extraQuestions: extraQuestions }
        }
        default:
            return state;
    }
}

export default baseReducer
