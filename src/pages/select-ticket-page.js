import React from 'react';
import history from '../history'
import { Dropdown } from 'openstack-uicore-foundation/lib/components'
import {connect} from "react-redux";
import {loadSummits, setSummit} from "../actions/base-actions";
import T from "i18n-react/dist/i18n-react";

import "../styles/select-ticket-page.less"

class SelectTicketPage extends React.Component {

    onSelectTicket = (ticketId) => {
        const {match} = this.props;
        history.push(`${match.url}/${ticketId}`);
    };

    onCancel = () => {
        const {summit} = this.props;
        history.push(`/check-in/${summit.slug}`)
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
})(SelectTicketPage)
