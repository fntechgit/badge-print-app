import React from 'react';
import {connect} from "react-redux";
import T from "i18n-react/dist/i18n-react";
import history from '../history';
import QrReader from 'react-qr-reader'
import Swal from "sweetalert2";
import validator from 'validator';
import {getTicket, findTicketsByName, findTicketsByEmail} from "../actions/ticket-actions";
import {scanQRCode} from "../actions/qrcode-actions";

import "../styles/find-ticket-page.less"

class FindTicketPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showQRreader: false,
            error       : ''
        };

    }

    toggleScanner = () => {
        const { showQRreader } = this.state;
        this.setState({ showQRreader: !showQRreader})
    };

    handleScan = (qrCode) => {
        const { summit, match } = this.props;
        if (qrCode) {
            this.setState({showQRreader: false});
            let qrCodeArray = qrCode.split(summit.qr_registry_field_delimiter);

            if (qrCodeArray.length < 2 || qrCodeArray[0] !== summit.ticket_qr_prefix) {
                Swal.fire(
                    T.translate("find_ticket.wrong_qr_title"),
                    T.translate("find_ticket.wrong_qr_text"),
                    "warning"
                );
            } else {
                history.push(`${match.url}/tickets/${qrCodeArray[1]}`);
            }
        }
    };

    handleError = (err) => {
        this.setState({showQRreader: false});

        Swal.fire({
            title: T.translate("find_ticket.wrong_qr_title"),
            text: T.translate("find_ticket.wrong_qr_text"),
            type: "warning",
        });
    };

    handleFindByName = () => {
        const { match, findTicketsByName } = this.props;
        const firstName = this.firstName.value.trim();
        const lastName = this.lastName.value.trim();

        if (firstName && lastName) {
            findTicketsByName(firstName, lastName).then(
                (data) => {
                    if (data.length === 1) {
                        history.push(`${match.url}/tickets/${data[0].number}`);
                    } else if (data.length > 1) {
                        history.push(`${match.url}/tickets`);
                    }
                }
            );
        } else {
            this.setState({error: 'name'});
        }
    };

    handleFindByEmail = () => {
        const { match, findTicketsByEmail } = this.props;
        const email = this.email.value;

        if (email && validator.isEmail(email)) {
            findTicketsByEmail(email).then(
                (data) => {
                    if (data.length === 1) {
                        history.push(`${match.url}/tickets/${data[0].number}`);
                    } else if (data.length > 1) {
                        history.push(`${match.url}/tickets`);
                    }
                }
            );
        } else {
            this.setState({error: 'email'});
        }
    };

    handleScanQRCode = () => {
        const { scanQRCode } = this.props;

        scanQRCode().then(
            (data) => {
                this.handleScan(data);
            }
        );
    };
    
    render(){
        const { showQRreader, error } = this.state;

        const embedded = window.embedded !== undefined;

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
                                style={{ width: '300px' }}
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
                            <div className="col-md-12 find-tix-wrapper">
                                <div className="find-tix-label">
                                    {T.translate("find_ticket.name_title")}
                                </div>
                                <div className="find-tix-form">
                                    <input
                                        className={`form-control input ${error === 'name' && 'error'}`}
                                        id="first_name"
                                        type="text"
                                        spellcheck="false"
                                        placeholder={T.translate("find_ticket.first_name")}
                                        ref={el => this.firstName = el}
                                        onChange={() => this.setState({error: ''})}
                                    />
                                    <input
                                        className={`form-control input ${error === 'name' && 'error'}`}
                                        id="last_name"
                                        type="text"
                                        spellcheck="false"
                                        placeholder={T.translate("find_ticket.last_name")}
                                        ref={el => this.lastName = el}
                                        onChange={() => this.setState({error: ''})}
                                    />
                                    {error === 'name' &&
                                    <p className="error">{T.translate("find_ticket.valid_name")}</p>
                                    }
                                </div>
                                <div className="find-tix-button">
                                    <button className="btn btn-primary" onClick={this.handleFindByName}>
                                        {T.translate("general.continue")}
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-12 find-tix-wrapper">
                                <div className="find-tix-label">
                                    {T.translate("find_ticket.email_title")}
                                </div>
                                <div className="find-tix-form">
                                    <input
                                        className={`form-control input ${error === 'email' && 'error'}`}
                                        id="email"
                                        type="email"
                                        placeholder={T.translate("find_ticket.email")}
                                        ref={el => this.email = el}
                                        onChange={() => this.setState({error: ''})}
                                    />
                                    {error === 'email' &&
                                    <p className="error">{T.translate("find_ticket.valid_email")}</p>
                                    }
                                </div>
                                <div className="find-tix-button">
                                    <button className="btn btn-primary" onClick={this.handleFindByEmail}>
                                        {T.translate("general.continue")}
                                    </button>
                                </div>
                            </div>
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
    getTicket,
    findTicketsByName,
    findTicketsByEmail,
    scanQRCode,
})(FindTicketPage)
