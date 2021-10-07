import React from 'react';
import { connect } from "react-redux";
import history from '../history';
import T from "i18n-react/dist/i18n-react";
import { getBadge, incrementBadgePrintCount, printBadge } from "../actions/badge-actions";
import Badge from '../model/badge';
import ErrorPage from './error-page'

import '../styles/badge-common.less'
import '../styles/print-page.less'

class PrintPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            embedded: window.embedded !== undefined,
        };
    }

    componentDidMount() {
        let summitSlug = this.props.match.params.summit_slug;
        let ticketId = this.props.match.params.ticket_id;

        this.props.getBadge(summitSlug, ticketId);
    }

    cancelPrint = (ev) => {
        let summitSlug = this.props.match.params.summit_slug;
        history.push(`/check-in/${summitSlug}`);
    };

    handlePrint = (ev) => {
        let { embedded } = this.state;
        let { history, incrementBadgePrintCount, printBadge } = this.props;

        let ticketId = this.props.match.params.ticket_id;
        let summitSlug = this.props.match.params.summit_slug;

        let location = `/check-in/${summitSlug}/thank-you`;

        let callback = () => {
            incrementBadgePrintCount(summitSlug, ticketId);
            history.push(location);
        };

        if (embedded) {
            let element = document.getElementById('badge-artboard');
            let payload = { height: element.clientHeight, width: element.clientWidth };
            printBadge(payload).then(
                (data) => {
                    callback()
                }
            );
        } else {
            window.onafterprint = function() {
                // on focus event will occur after print dialog is resolved
                window.onfocus = function() {
                    callback();
                }
            }
            window.print();
        };
    };

    render(){
        let { badge, match, location, loading, summitSlug } = this.props;

        if (loading) return (<div className="loading-badge">{T.translate("preview.loading")}</div>);

        if (!match.params.summit_slug || !match.params.ticket_id) {
            return (<ErrorPage message={T.translate("preview.summit_missing")} />);
        }

        if (!badge && !loading) {
            return (<ErrorPage message={T.translate("preview.error_retrieving")} />);
        }

        let badgeObj = new Badge(badge);

        return (
            <div className="container print-page-wrapper">
                <div className="badge-wrapper">
                    {badgeObj.renderTemplate(summitSlug)}
                </div>
                <div className="row print-buttons-wrapper">
                    <div className="col-md-4 col-md-offset-4">
                        <button className="btn btn-primary" onClick={this.handlePrint}>
                            {T.translate("preview.confirm")}
                        </button>
                        <button className="btn btn-danger" onClick={this.cancelPrint}>
                            {T.translate("preview.cancel")}
                        </button>
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
    getBadge,
    incrementBadgePrintCount,
    printBadge
})(PrintPage)
