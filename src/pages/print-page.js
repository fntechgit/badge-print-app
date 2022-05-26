import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import history from '../history';
import T from 'i18n-react/dist/i18n-react';
import { getBadge, incrementBadgePrintCount, clearBadge, printBadge } from '../actions/badge-actions';
import { getAllTickets } from '../actions/ticket-actions';
import Timeout from '../components/Timeout';
import Badge from '../model/badge';
import ErrorPage from './error-page';

import '../styles/badge-common.less';
import '../styles/print-page.less';

const PrintStatus = {
    NotPrinted: 0,
    Printed: 1,
    Error: 2
}

const GoTo = {
    ThankYouPage: 0,
    NextBadge: 1
}

class PrintPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            embedded: window.embedded !== undefined,
            ticketId: null,
            ticketIds: [],
            willCheckIn: true,
            printJobStatus: null,
            autoProcessBatch: false,
            batchPrintingComplete: false
        };
        this.isFirstOfBatch = this.isFirstOfBatch.bind(this);
        this.isLastOfBatch = this.isLastOfBatch.bind(this);
    }

    initializePrintJob = (ticketIds = []) => {
        const printJobStatus = {};
        const defaultStatus = { printed: false };
        ticketIds.forEach(ticketId => printJobStatus[ticketId] = PrintStatus.NotPrinted);
        this.setState({ ticketIds: ticketIds, printJobStatus });
    }

    componentWillMount = () => {
        const qs = require('query-string');
        const parsedQueryString = qs.parse(this.props.location.search, { ignoreQueryPrefix: true});
        const checkIn = parsedQueryString['check_in'];

        const { summit_slug: summitSlug, ticket_id: ticketId } = this.props.match.params;
        const newState = { ...this.state };
        newState.summitSlug = summitSlug;
        if (ticketId) newState.ticketId = ticketId;
        console.log(`PrintPage::componentWillMount checkIn ${checkIn}`);
        if (checkIn) newState.willCheckIn = (checkIn === 'true');
        const comaSeparatedTicketIds = parsedQueryString['ids'];
        const filters = parsedQueryString['filter[]'];

        this.setState(newState, () => {
            if (comaSeparatedTicketIds) {
                this.initializePrintJob(comaSeparatedTicketIds.split(','));
            } else if (filters) {
                const filters = parsedQueryString['filter[]'];
                this.props.getAllTickets({ filters, fields: 'id', relations: 'none' })
                    .then((tickets) => this.initializePrintJob(tickets.map(ticket => ticket.id.toString())));
            }
        });
    }

    componentDidMount = () => {
        const { summitSlug, ticketId } = this.state;
        if (ticketId) {
            this.props.getBadge(summitSlug, ticketId);
        }
    }

    componentDidUpdate = (prevProps) => {
        const { ticket_id: ticketId } = this.props.match.params;
        const { ticket_id: prevTicketId } = prevProps.match.params;
        if (ticketId && ticketId !== prevTicketId) {
            const { summitSlug } = this.state;
            this.props.getBadge(summitSlug, ticketId);
            this.setState({ ticketId });
        }
    }

    goToThankYou = () => history.push(`/check-in/${this.state.summitSlug}/thank-you`);

    handlePrint = ({ goTo }) => {
        if (this.state.embedded) {
            const element = document.getElementById('badge-artboard');
            const payload = { height: element.clientHeight, width: element.clientWidth };
            // call native printing then increment count
            this.props.printBadge(payload).then(() =>
                this.incrementPrintCount().then(() => 
                    this.props.clearBadge().then(this.goToThankYou)
                )
            );
        } else {
            this.incrementPrintCount().then(() => {
                // print after incrementing count
                window.print();
                if (this.isBatchPrinting()) {
                    const { ticketId, printJobStatus } = this.state; 
                    const newPrintJobStatus = { ...printJobStatus };
                    newPrintJobStatus[ticketId] = PrintStatus.Printed;
                    this.setState({ printJobStatus: newPrintJobStatus });
                    if (goTo == GoTo.NextBadge)
                        setTimeout(() => this.goToNextBadge({ notPrinted: true }), 7000);
                } else {
                    this.props.clearBadge().then(this.goToThankYou);
                }
            });
        }
    };

    incrementPrintCount = () => {
        const { summitSlug, ticketId, willCheckIn } = this.state;
        console.log(`PrintPage::incrementPrintCount summitSlug ${summitSlug} ticketId ${ticketId} ${willCheckIn}`);
        return this.props.incrementBadgePrintCount(summitSlug, ticketId, willCheckIn);
    };

    cancelPrint = () => {
        this.props.clearBadge().then(() => {
            history.push(`/check-in/${this.state.summitSlug}`);
        })
    };

    goToFindTicketPage = () => history.push(`/check-in/${this.state.summitSlug || ''}`);

    isBatchPrinting = () => this.state.ticketIds.length > 0;

    isBatchPrintingComplete = () => {
        const { ticketIds, printJobStatus } = this.state;
        return ticketIds.map(ticketId => printJobStatus[ticketId]).every(status => status.printed === true);
    }

    isFirstOfBatch = () => {
        const { ticketId, ticketIds } = this.state;
        return ticketIds.indexOf(ticketId) == 0;
    }

    goToPrevBadge = () => {
        const { summitSlug, ticketId, ticketIds } = this.state;
        const currentIndex = ticketIds.indexOf(ticketId);
        const prevIndex = currentIndex == 0 ? ticketIds.length - 1 : currentIndex - 1;
        history.push(`/check-in/${summitSlug}/tickets/${ticketIds[prevIndex]}`);
    }

    isLastOfBatch = () => {
        const { ticketId, ticketIds } = this.state;
        return ticketIds.indexOf(ticketId) == ticketIds.length - 1;
    }

    goToNextBadge = ({ notPrinted = false }) => {
        const { summitSlug, ticketId, ticketIds, printJobStatus } = this.state;
        const currentIndex = ticketIds.indexOf(ticketId);
        let nextIndex = currentIndex == ticketIds.length - 1 ? 0 : currentIndex + 1;
        if (notPrinted) {
             if (this.isBatchPrintingComplete()) {
                this.setState({ batchPrintingComplete: true });
                this.props.clearBadge();
                return;
            }
            while (printJobStatus[ticketIds[nextIndex]] == PrintStatus.Printed) {
                nextIndex = nextIndex == ticketIds.length - 1 ? 0 : nextIndex + 1;
            }
        }
        history.push(`/check-in/${summitSlug}/tickets/${ticketIds[nextIndex]}`);
    }

    handleProcessBatchChange = () => {
        this.setState({ autoProcessBatch: !this.state.autoProcessBatch });
    };

    processBatch = () => {
        if (this.isBatchPrintingComplete()) {
            this.setState({ batchPrintingComplete: true });
            this.props.clearBadge();
            return;
        }
        const { summitSlug, ticketId, ticketIds, printJobStatus } = this.state;
        const currentIndex = ticketIds.indexOf(ticketId);
        if (printJobStatus[ticketIds[currentIndex]] !== PrintStatus.Printed) {
            this.handlePrint({ goTo: GoTo.NextBadge });
        } else {
            this.goToNextBadge({ notPrinted: true });
        }
    }

    render() {
        const { summitSlug, ticketId, ticketIds, printJobStatus, autoProcessBatch, batchPrintingComplete } = this.state;
        const { loading, badge } = this.props;

        if (loading) return (<div className="loading-badge">{T.translate("preview.loading")}</div>);

        if (summitSlug && !ticketId && this.isBatchPrinting()) {
            return <Redirect to={`/check-in/${summitSlug}/tickets/${ticketIds[0]}`} />;
        }

        if (!summitSlug || !ticketId) {
            return <ErrorPage message={T.translate("preview.summit_missing")} onLinkClick={this.goToFindTicketPage} />;
        }

        if (!badge && !loading) {
            return <ErrorPage title={T.translate("preview.error_retrieving")} message={T.translate("preview.contact_help")} onLinkClick={this.goToFindTicketPage} />;
        }

        const badgeObj = new Badge(badge);

        return (
            <div className="container print-page-wrapper">
                <div className="badge-wrapper">
                    {badgeObj.renderTemplate(summitSlug)}
                </div>
                { !this.isBatchPrinting() &&  
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
                }
                <br/>
                { this.isBatchPrinting() && !batchPrintingComplete &&
                <div className="row print-buttons-wrapper">
                    <div className="col-md-2 col-md-offset-5">
                        <label>
                            <input type="checkbox" checked={autoProcessBatch} onChange={this.handleProcessBatchChange} />
                            <span>&nbsp; auto process batch</span>
                        </label>
                        <Timeout callback={this.processBatch} paused={!autoProcessBatch} />
                    </div>
                </div>
                }
                { this.isBatchPrinting() && !autoProcessBatch && !batchPrintingComplete &&
                <div className="row print-buttons-wrapper">
                    <div className="col-md-1 col-md-offset-4">
                        <button className="btn btn-danger" disabled={this.isFirstOfBatch()} onClick={this.goToPrevBadge}>
                            {T.translate("<")}
                        </button>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary" onClick={this.handlePrint}>
                            {T.translate("Print")}
                        </button>
                    </div>
                    <div className="col-md-1">
                        <button className="btn btn-primary" disabled={this.isLastOfBatch()} onClick={this.goToNextBadge}>
                            {T.translate(">")}
                        </button>
                    </div>
                </div>
                }
            </div>
        );
    }
}

const mapStateToProps = ({ baseState }) => ({
    ...baseState
});

export default connect(mapStateToProps, {
    getAllTickets,
    getBadge,
    incrementBadgePrintCount,
    printBadge,
    clearBadge
})(PrintPage)
