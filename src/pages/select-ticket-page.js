import React from 'react';
import history from '../history'
import { connect } from "react-redux";
import ErrorPage from './error-page';
import { ATTENDEE_STATUS_INCOMPLETE } from '../utils/constants';
import { setSelectedTicket } from '../actions/ticket-actions';
import { clearBadge } from "../actions/badge-actions";
import "../styles/select-ticket-page.less"
import T from "i18n-react/dist/i18n-react";

class SelectTicketPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            alreadyCheckedIn : false,
        };

    }
    onSelectTicket = (ticketId) => {
        const { userIsAdmin, allTickets, summit, setSelectedTicket} = this.props;
        const ticket = allTickets.find((t) => t.id === ticketId);
        if (!userIsAdmin) {
            if (ticket.owner.summit_hall_checked_in) {
                this.setState({ alreadyCheckedIn: true });
                return;
            }
            if (ticket.owner.status === ATTENDEE_STATUS_INCOMPLETE){
                setSelectedTicket(ticket).then(() => {
                    history.push(`/check-in/${summit.slug}/extra-questions`);
                });
                return;
            }
        }
        history.push(`/check-in/${summit.slug}/tickets/${ticketId}`);
    };

    onCancel = () => {
        const {summit, clearBadge} = this.props;
        clearBadge().then(() => history.push(`/check-in/${summit.slug}`));
    };

    render(){
        let { allTickets, searchTerm } = this.props;
        const { alreadyCheckedIn } = this.state;

        if (alreadyCheckedIn) {
            return (
                <ErrorPage
                    title={T.translate("find_ticket.checked_in")}
                    message={T.translate("find_ticket.checked_in_message")}
                    linkText={T.translate("find_ticket.try_again")}
                    onLinkClick={() => this.setState({ alreadyCheckedIn: false })}
                />
            );
        }

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
    setSelectedTicket,
    clearBadge,
})(SelectTicketPage)
