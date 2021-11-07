import React from 'react';
import history from '../history'
import {connect} from "react-redux";
import {loadSummits, setSummit} from "../actions/base-actions";
import {ATTENDEE_STATUS_INCOMPLETE} from '../utils/constants';
import {setSelectedTicket} from '../actions/ticket-actions';
import {clearBadge} from "../actions/badge-actions";
import "../styles/select-ticket-page.less"
import T from "i18n-react/dist/i18n-react";

class SelectTicketPage extends React.Component {

    onSelectTicket = (ticketId) => {
        const { allTickets, summit, setSelectedTicket} = this.props;
        const ticket = allTickets.find((t) => t.id === ticketId);
        if(ticket.owner.status === ATTENDEE_STATUS_INCOMPLETE){
            setSelectedTicket(ticket).then(() => {
                history.push(`/check-in/${summit.slug}/extra-questions`);
            })
        }
        else
            history.push(`/check-in/${summit.slug}/tickets/${ticketId}`);
    };

    onCancel = () => {
        const {summit, clearBadge} = this.props;
        clearBadge().then(() => history.push(`/check-in/${summit.slug}`));
    };

    render(){
        let { allTickets, searchTerm } = this.props;

        return (
            <div className="container select-ticket-page">
                <div className="row select-ticket-header">
                    <div className="col-md-12 select-ticket-title">
                        {`${allTickets.length} ${T.translate("select_ticket.found_for")} ${searchTerm}`}
                    </div>
                    <div className="col-md-12 select-ticket-subtitle">
                        {T.translate("select_ticket.choose_one")}:
                    </div>
                </div>
                <div className="select-ticket-box">
                    {allTickets.map(tix =>
                        <div key={`tix_${tix.id}`} className="row tix-box" onClick={this.onSelectTicket.bind(this, tix.id)}>
                            <div className="col-md-6">
                                <span className="tix-label">
                                    {T.translate("select_ticket.ticket_no")}
                                </span>
                                <br/>
                                {tix.number}
                            </div>
                            <div className="col-md-3">
                                <span className="tix-label">
                                    {T.translate("select_ticket.email")}
                                </span>
                                <br/>
                                {tix.owner.email}
                            </div>
                            <div className="col-md-3">
                                <span className="tix-label">
                                    {T.translate("select_ticket.badge")}
                                </span>
                                <br/>
                                {tix.badge.type.name}
                            </div>
                        </div>
                    )}
                </div>
                <div className="row">
                    <div className="col-md-4 col-md-offset-4">
                        <button className="btn btn-danger" onClick={this.onCancel}>
                            {T.translate("general.cancel")}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = ({ baseState, loggedUserState }) => ({
    isLoggedUser: loggedUserState.isLoggedUser,
    ...baseState
});

export default connect(mapStateToProps, {
    loadSummits,
    setSummit,
    setSelectedTicket,
    clearBadge,
})(SelectTicketPage)
