import React from 'react';
import { connect } from "react-redux";
import history from '../history';
import T from "i18n-react/dist/i18n-react";
import { getBadge, incrementBadgePrintCount, printBadge, clearBadge } from "../actions/badge-actions";
import Badge from '../model/badge';
import ErrorPage from './error-page';

import '../styles/badge-common.less'
import '../styles/print-page.less'

class PrintPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            embedded: window.embedded !== undefined,
        };
        this.afterPrintCallback = this.afterPrintCallback.bind(this);
    }

    afterPrintCallback ()  {
        let { history, incrementBadgePrintCount, clearBadge, match } = this.props;
        const ticketId = match.params.ticket_id;
        const summitSlug = match.params.summit_slug;
        const location = `/check-in/${summitSlug}/thank-you`;
        incrementBadgePrintCount(summitSlug, ticketId)
            .then(() => clearBadge()
                .then(() =>  history.push(location)));
    };

    componentDidMount() {
        let { getBadge, match, incrementBadgePrintCount } = this.props;
        let { embedded } = this.state;
        let summitSlug = match.params.summit_slug;
        let ticketId = match.params.ticket_id;
        getBadge(summitSlug, ticketId).then(() => {
            if(!embedded) {
                incrementBadgePrintCount(summitSlug, ticketId);
            }
        });
    }

    cancelPrint = () => {
        this.props.clearBadge().then(() => {
            history.push(`/check-in/${this.props.match.params.summit_slug}`);
        })
    };

    handlePrint = () => {
        let { embedded } = this.state;
        let { printBadge } = this.props;

        if (embedded) {
            let element = document.getElementById('badge-artboard');
            let payload = { height: element.clientHeight, width: element.clientWidth };
            printBadge(payload).then(
                () => {
                    this.afterPrintCallback();
                }
            );
            return;
        }
        window.print();
    };

    goToFindTicketPage = () => {
        const { summitSlug } = this.props;
        const path = summitSlug || ''
        history.push(`/check-in/${path}`);
    };

    render(){
        let { badge, match, loading, summitSlug } = this.props;

        if (loading) return (<div className="loading-badge">{T.translate("preview.loading")}</div>);

        if (!match.params.summit_slug || !match.params.ticket_id) {
            return (<ErrorPage message={T.translate("preview.summit_missing")} onLinkClick={this.goToFindTicketPage} />);
        }

        if (!badge && !loading) {
            return (<ErrorPage title={T.translate("preview.error_retrieving")} message={T.translate("preview.contact_help")} onLinkClick={this.goToFindTicketPage} />);
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
    printBadge,
    clearBadge
})(PrintPage)
