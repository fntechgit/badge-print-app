import * as React from "react";
import { connect } from "react-redux";
import T from "i18n-react/dist/i18n-react";
import Swal from "sweetalert2";
import validator from "validator";
import history from "../history";
import {
    findTicketByQRCode,
    findTicketsByName,
    findTicketsByEmail,
    findExternalTicketsByEmail,
    setSelectedTicket
} from "../actions/ticket-actions";
import { scanQRCode } from "../actions/qrcode-actions";
import QrReader from "../components/QrReader";
import ErrorPage from "./error-page";
import { ATTENDEE_STATUS_INCOMPLETE, PRINT_APP_HIDE_FIND_TICKET_BY_EMAIL, PRINT_APP_HIDE_FIND_TICKET_BY_FULLNAME } from '../utils/constants';

import "../styles/find-ticket-page.less"

class FindTicketPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            embedded         : window.embedded !== undefined,
            showQRreader     : false,
            showErrorPage    : false,
            alreadyCheckedIn : false,
            error            : "",
        };

    }

    toggleScanner = () => {
        const { showQRreader } = this.state;
        this.setState({ showQRreader: !showQRreader})
    };

    handleScan = (qrCode) => {
        const { userIsAdmin, summit, match, findTicketByQRCode } = this.props;
        if (qrCode) {
            this.setState({ showQRreader: false });
            findTicketByQRCode(qrCode).then((ticket) => {
                if (!userIsAdmin) {
                    if (ticket.owner.summit_hall_checked_in) {
                        this.setState({ alreadyCheckedIn: true });
                        return;
                    }
                    if (ticket.owner.status === "Incomplete") {
                        history.push(`/check-in/${summit.slug}/extra-questions`);
                        return;
                    }
                }
                history.push(`/check-in/${summit.slug}/tickets/${ticket.id}`);
            }).catch((error) => this.setState({ showErrorPage: true }))
        }
    };

    handleError = (err) => {
        this.setState({ showQRreader: false });

        Swal.fire({
            title: T.translate("find_ticket.wrong_qr_title"),
            text: T.translate("find_ticket.wrong_qr_text"),
            type: "warning",
        });
    };

    handleFindByName = () => {
        const { userIsAdmin, summit, findTicketsByName, setSelectedTicket } = this.props;
        const firstName = this.firstName.value.trim();
        const lastName = this.lastName.value.trim();

        if (firstName && lastName) {
            findTicketsByName(firstName, lastName).then(
                (data) => {
                    if (data.length === 1) {
                        let ticket = data[0];
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
                        history.push(`/check-in/${summit.slug}/tickets/${ticket.id}`);
                    } else if (data.length > 1) {
                        history.push(`/check-in/${summit.slug}/select-ticket`);
                    } else {
                        this.setState({ showErrorPage: true })
                    }
                }
            );
            return;
        }

        this.setState({ error: "name" });

    };

    /**
     *
     * @param data
     * @param useExternalFallback
     */
    processFindByEmailData = (data, useExternalFallback = true) => {
        const { userIsAdmin, summit, findExternalTicketsByEmail, setSelectedTicket } = this.props;
        if (data.length === 1) {
            let ticket = data[0];
            if (!userIsAdmin) {
                if (ticket.owner.summit_hall_checked_in) {
                    this.setState({ alreadyCheckedIn: true })
                    return;
                }
                if (ticket.owner.status === ATTENDEE_STATUS_INCOMPLETE){
                    setSelectedTicket(ticket).then(() => {
                        history.push(`/check-in/${summit.slug}/extra-questions`);
                    });
                    return;
                }
            }
            history.push(`/check-in/${summit.slug}/tickets/${ticket.id}`);
        } else if (data.length > 1) {
            history.push(`/check-in/${summit.slug}/select-ticket`);
        } else {
            // empty data set , check if we have external reg feed
            if (summit.external_registration_feed_type != "" && useExternalFallback) {
                findExternalTicketsByEmail(this.email.value).then((data) => {
                    this.processFindByEmailData(data, false);
                }).catch(() => this.setState({ showErrorPage: true }));
                return;
            }

            this.setState({ showErrorPage: true })
        }
    }

    handleFindByEmail = () => {
        const { findTicketsByEmail } = this.props;
        const email = this.email.value;

        if (email && validator.isEmail(email)) {
            findTicketsByEmail(email).then((data) => this.processFindByEmailData(data));
            return;
        }
        this.setState({ error: "email" });
    };

    handleScanQRCode = () => {
        const { scanQRCode } = this.props;

        scanQRCode().then(
            (data) => this.handleScan(data)
        );
    };

    shouldHideField = (summitSetting) => {
        const { marketingSettings } = this.props;
        const setting = marketingSettings?.find(s => s.key === summitSetting);
        return setting?.value === "1" ? true : false;
    }

    render(){
        const { embedded, showQRreader, showErrorPage, alreadyCheckedIn, error } = this.state;
        const { searchTerm } = this.props;

        if (alreadyCheckedIn) {
            return (
                <ErrorPage
                    title={T.translate("find_ticket.checked_in")}
                    message={searchTerm ? T.translate("find_ticket.checked_in_message", { search_term: searchTerm }) :
                        T.translate("find_ticket.checked_in_message_qr_code")}
                    linkText={T.translate("find_ticket.try_again")}
                    onLinkClick={() => this.setState({ alreadyCheckedIn: false })}
                />
            );
        }

        if (showErrorPage) {
            return (
                <ErrorPage
                    title={T.translate("find_ticket.not_found")}
                    message={ searchTerm ? T.translate("find_ticket.not_found_message", { search_term: searchTerm }) :
                        T.translate("find_ticket.not_found_message_qr_code")}
                    linkText={T.translate("find_ticket.try_again")}
                    onLinkClick={() => this.setState({ showErrorPage: false })}
                />
            );
        }

        return (
            <div className="container find-tix-page">
                <div className="row find-ticket-header">
                    <div className="col-md-12 find-ticket-title">
                        {T.translate("find_ticket.welcome")}
                    </div>
                    <div className="col-md-12 find-ticket-subtitle">
                        {T.translate("find_ticket.check_in")}:
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 find-tix-wrapper qr-wrapper">
                        <div className="find-tix-label">
                            {T.translate("find_ticket.qr_code_title")}
                        </div>
                        <div className="find-tix-form qr-window">
                            {!embedded && showQRreader &&
                            <QrReader
                                delay={300}
                                onError={this.handleError}
                                onScan={this.handleScan}
                                style={{ width: "300px" }}
                            />
                            }
                        </div>
                        <div className="find-tix-button">
                            {!embedded && !showQRreader &&
                            <button className="btn btn-primary" onClick={this.toggleScanner}>
                                {T.translate("find_ticket.qr_code_btn")}
                            </button>
                            }
                            {!embedded && showQRreader &&
                            <button className="btn btn-danger" onClick={this.toggleScanner}>
                                {T.translate("find_ticket.qr_code_cancel")}
                            </button>
                            }
                            {embedded &&
                            <button className="btn btn-primary" onClick={this.handleScanQRCode}>
                                {T.translate("find_ticket.qr_code_btn")}
                            </button>
                            }
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            {!this.shouldHideField(PRINT_APP_HIDE_FIND_TICKET_BY_EMAIL) &&
                            <div className="col-md-12 find-tix-wrapper">
                                <div className="find-tix-label">
                                    {T.translate("find_ticket.email_title")}
                                </div>
                                <div className="find-tix-form">
                                    <input
                                        className={`form-control input ${error === "email" && "error"}`}
                                        id="email"
                                        type="email"
                                        placeholder={T.translate("find_ticket.email")}
                                        ref={el => this.email = el}
                                        onChange={() => this.setState({error: ""})}
                                    />
                                    { error === 'email' &&
                                    <p className="error">{T.translate("find_ticket.valid_email")}</p>
                                    }
                                </div>
                                <div className="find-tix-button">
                                    <button className="btn btn-primary" onClick={this.handleFindByEmail}>
                                        {T.translate("general.continue")}
                                    </button>
                                </div>
                            </div>
                            }
                            {!this.shouldHideField(PRINT_APP_HIDE_FIND_TICKET_BY_FULLNAME) &&
                            <div className="col-md-12 find-tix-wrapper">
                                <div className="find-tix-label">
                                    {T.translate("find_ticket.name_title")}
                                </div>
                                <div className="find-tix-form">
                                    <input
                                        className={`form-control input ${error === "name" && "error"}`}
                                        id="first_name"
                                        type="text"
                                        spellCheck="false"
                                        placeholder={T.translate("find_ticket.first_name")}
                                        ref={el => this.firstName = el}
                                        onChange={() => this.setState({error: ''})}
                                    />
                                    <input
                                        className={`form-control input ${error === "name" && "error"}`}
                                        id="last_name"
                                        type="text"
                                        spellCheck="false"
                                        placeholder={T.translate("find_ticket.last_name")}
                                        ref={el => this.lastName = el}
                                        onChange={() => this.setState({error: ''})}
                                    />
                                    { error === "name" &&
                                        <p className="error">{T.translate("find_ticket.valid_name")}</p>
                                    }
                                </div>
                                <div className="find-tix-button">
                                    <button className="btn btn-primary" onClick={this.handleFindByName}>
                                        {T.translate("general.continue")}
                                    </button>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ baseState }) => ({
    ...baseState
});

export default connect(mapStateToProps, {
    findTicketByQRCode,
    findTicketsByName,
    findTicketsByEmail,
    findExternalTicketsByEmail,
    scanQRCode,
    setSelectedTicket,
})(FindTicketPage)
