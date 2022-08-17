import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import history from '../history';
import qs from 'query-string';
import T from 'i18n-react/dist/i18n-react';
import {
    getBadge,
    incrementBadgePrintCount,
    clearBadge,
    printBadge
} from '../actions/badge-actions';
import { getAllTickets } from '../actions/ticket-actions';
import Timeout from '../components/Timeout';
import Badge from '../model/badge';
import ErrorPage from './error-page';

import {
    ButtonToolbar,
    ToggleButtonGroup,
    ToggleButton
} from 'react-bootstrap';

import '../styles/badge-common.less';
import '../styles/print-page.less';

const RedirectTimeOut = 7000;

const PrintStatus = {
    NotPrinted: 'NotPrinted',
    Printed: 'Printed',
    Error: 'Error',
};

const TicketStatusPrototype = {
    init(viewTypes) {
        viewTypes.forEach(
            (viewType) => (this[viewType] = PrintStatus.NotPrinted)
        );
    },
    get viewTypes() {
        return Object.keys(this);
    },
    get printStatuses() {
        return Object.values(this);
    },
    isViewTypePrinted(viewType) {
        return this[viewType] == PrintStatus.Printed;
    },
    areViewTypesPrinted() {
        return this.printStatuses.every(
            (printStatus) => printStatus == PrintStatus.Printed
        );
    },
};

class PrintPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            embedded: window.embedded !== undefined,
            summitSlug: null,
            willCheckIn: true,
            batchItemsRef: [],
            printJobStatus: null,
            viewTypeOverride: null,
            autoProcessBatch: false,
            batchPrintingComplete: false
        };
        this.isFirstOfBatch = this.isFirstOfBatch.bind(this);
        this.isLastOfBatch = this.isLastOfBatch.bind(this);
        this.handleViewTypeChange = this.handleViewTypeChange.bind(this);
    };

    initPrintJob = (tickets = []) => {
        const { viewTypeOverride } = this.state;
        // linear representation of all ticket view types variations, unless viewTypeOverride
        // format "ticketId|viewType"
        const batchItemsRef = [];
        const printJobStatus = {};
        tickets.forEach((ticket) => {
            if (viewTypeOverride) {
                batchItemsRef.push(`${ticket.id}|${viewTypeOverride}`);
                printJobStatus[ticket.id] = Object.create(TicketStatusPrototype);
                printJobStatus[ticket.id].init([viewTypeOverride]);
            } else {
                const { allowed_view_types: allowedViewTypes } = ticket.badge?.type;
                const viewTypes = allowedViewTypes.map((viewType) => viewType.id);
                viewTypes.forEach((viewType) => batchItemsRef.push(`${ticket.id}|${viewType}`));
                printJobStatus[ticket.id] = Object.create(TicketStatusPrototype);
                printJobStatus[ticket.id].init(viewTypes);
            }
        }); 
        this.setState({ batchItemsRef, printJobStatus });
    };

    componentWillMount = () => {
        const { summit_slug: summitSlug } = this.props.match.params;

        const parsedQueryString = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        const filters = parsedQueryString['filter[]'];
        const viewType = parsedQueryString['view_type'];
        const checkIn = parsedQueryString['check_in'];
        const order = parsedQueryString['order'];

        const newState = { ...this.state };
        newState.summitSlug = summitSlug;
        if (viewType) newState.viewTypeOverride = viewType;
        if (checkIn) newState.willCheckIn = (checkIn === 'true');
        console.log(`PrintPage::componentWillMount viewType ${viewType} checkIn ${checkIn}`);

        this.setState(newState, () => {
            const { ticket_id: ticketId } = this.props.match.params;
            // if no ticket id provided, we fetch all tickets
            // thus start a batch printing
            if (!ticketId) {           
                this.props.getAllTickets({
                    filters,
                    order,
                    expand: 'badge,badge.type,badge.type.allowed_view_types'
                }).then((tickets) => this.initPrintJob(tickets));
            }
        });
    };

    componentDidMount = () => {
        this.getBadge();
    };

    componentDidUpdate = (prevProps) => {
        this.getBadge(prevProps);
    };

    getBadge = (prevProps = null) => {
        const { summitSlug } = this.state;
        const { ticket_id: ticketId, view_type: viewType } = this.props.match.params;

        let shouldGetBadge = !!ticketId;
        if (prevProps) {
            const { ticket_id: prevTicketId,view_type: prevViewType } = prevProps.match.params;
            shouldGetBadge &&=
                ticketId != prevTicketId ||
                    (ticketId == prevTicketId && viewType != prevViewType);
        }
        if (shouldGetBadge) {
            if (viewType) {
                this.props.getBadge(summitSlug, ticketId, { viewType });
            } else {
                this.props.getBadge(summitSlug, ticketId);
            }
        }
    };

    goToPrevBadge = () => {
        const {
            summitSlug,
            batchItemsRef,
            printJobStatus,
            viewTypeOverride
        } = this.state;

        const { badgeTicketId, badgeViewType } = this.props;

        const currentIndex = batchItemsRef.indexOf(`${badgeTicketId}|${badgeViewType}`);
        const prevIndex = currentIndex == 0 ? batchItemsRef.length - 1 : currentIndex - 1;
        const [prevTicketId, prevViewType] = batchItemsRef[prevIndex].split('|');

        history.push(`/check-in/${summitSlug}/tickets/${prevTicketId}/views/${prevViewType}`);
    };

    goToNextBadge = (printStatus = null) => {
        const {
            summitSlug,
            batchItemsRef,
            printJobStatus,
            viewTypeOverride
        } = this.state;

        const { badgeTicketId, badgeViewType } = this.props;

        const currentIndex = batchItemsRef.indexOf(`${badgeTicketId}|${badgeViewType}`);
        let nextIndex = currentIndex == batchItemsRef.length - 1 ? 0 : currentIndex + 1;
        let [nextTicketId, nextViewType] = batchItemsRef[nextIndex].split('|');

        this.isBatchPrintingComplete();
        if (printStatus == PrintStatus.NotPrinted) {
            if (this.isBatchPrintingComplete()) {
                this.setState({ batchPrintingComplete: true }, () => this.props.clearBadge());
                return;
            }
            while (printJobStatus[nextTicketId].isViewTypePrinted(nextViewType)) {
                nextIndex = nextIndex == batchItemsRef.length - 1 ? 0 : nextIndex + 1;
                [nextTicketId, nextViewType] = batchItemsRef[nextIndex].split('|');
            }
        }

        history.push(`/check-in/${summitSlug}/tickets/${nextTicketId}/views/${nextViewType}`);
    };

    goToThankYou = () => history.push(`/check-in/${this.state.summitSlug}/thank-you`);

    goToFindTicketPage = () => history.push(`/check-in/${this.state.summitSlug || ''}`);

    cancelPrint = () => {
        this.props.clearBadge().then(() => {
            history.push(`/check-in/${this.state.summitSlug}`);
        })
    };

    isBatchPrinting = () => this.state.batchItemsRef.length > 0;

    isBatchPrintingComplete = () => {
        const { printJobStatus } = this.state;
        return Object.values(printJobStatus)
            .every((ticketStatus) => ticketStatus.areViewTypesPrinted()
        );
    };

    isFirstOfBatch = () => {
        const { batchItemsRef } = this.state;
        const { badgeTicketId, badgeViewType } = this.props;
        return batchItemsRef.indexOf(`${badgeTicketId}|${badgeViewType}`) == 0;
    };

    isLastOfBatch = () => {
        const { batchItemsRef } = this.state;
        const { badgeTicketId, badgeViewType } = this.props;
        return batchItemsRef.indexOf(`${badgeTicketId}|${badgeViewType}`) == batchItemsRef.length - 1;
    };

    handleProcessBatchChange = () => {
        this.setState({ autoProcessBatch: !this.state.autoProcessBatch });
    };

    processBatch = () => {
        if (this.isBatchPrintingComplete()) {
            this.setState({ batchPrintingComplete: true }, () => this.props.clearBadge());
            return;
        }
        const { printJobStatus } = this.state;
        const { badgeTicketId, badgeViewType } = this.props;
        if (!printJobStatus[badgeTicketId].isViewTypePrinted(badgeViewType)) {
            this.handlePrint(() => {
                setTimeout(() => this.goToNextBadge(PrintStatus.NotPrinted), RedirectTimeOut)
            });
        } else {
            this.goToNextBadge(PrintStatus.NotPrinted);
        }
    };

    handlePrint = (callback = () => {}) => {
        if (!(callback instanceof Function)) throw Error;

        if (this.state.embedded) {
            const element = document.getElementById('badge-artboard');
            const payload = {
                height: element.clientHeight,
                width: element.clientWidth,
                view: viewType,
            };
            // call native printing then increment count
            this.props.printBadge(payload).then(() =>
                this.incrementPrintCount().then(() => 
                    this.props.clearBadge().then(callback)
                )
            );
        } else {
            this.incrementPrintCount().then(() => {
                // print after incrementing count
                //window.print();
                if (this.isBatchPrinting()) {
                    const { printJobStatus } = this.state;
                    const { badgeTicketId, badgeViewType } = this.props;
                    const newPrintJobStatus = { ...printJobStatus };
                    newPrintJobStatus[badgeTicketId][badgeViewType] = PrintStatus.Printed;
                    this.setState({ printJobStatus: newPrintJobStatus }, callback);
                } else {
                    this.props.clearBadge().then(callback);
                }
            });
        }
    };

    incrementPrintCount = () => {
        const { summitSlug, willCheckIn } = this.state;
        const { badgeTicketId, badgeViewType } = this.props;
        console.log(`PrintPage::incrementPrintCount summitSlug ${summitSlug} ticketId ${badgeTicketId} viewType ${badgeViewType} checkIn ${willCheckIn}`);
        return this.props.incrementBadgePrintCount(summitSlug, badgeTicketId, { viewType: badgeViewType, checkIn: willCheckIn });
    };

    handleViewTypeChange(viewType) {
        const { summitSlug } = this.state;
        const { badgeTicketId } = this.props;
        history.push(`/check-in/${summitSlug}/tickets/${badgeTicketId}/views/${viewType}`);
    };

    render() {
        const {
            summitSlug,
            batchItemsRef,
            autoProcessBatch,
            batchPrintingComplete,
            viewTypeOverride,
        } = this.state;

        const { loading, badge, badgeTicketId, badgeAllowedViewTypes, badgeViewType } = this.props;

        if (loading) return (<div className="loading-badge">{T.translate("preview.loading")}</div>);

        if (summitSlug && !badgeTicketId && this.isBatchPrinting()) {
            const [ticketId, viewType] = batchItemsRef[0].split('|');
            return <Redirect to={`/check-in/${summitSlug}/tickets/${ticketId}/views/${viewType}`} />;
        }

        if (!summitSlug || !badgeTicketId) {
            return <ErrorPage message={T.translate("preview.summit_missing")} onLinkClick={this.goToFindTicketPage} />;
        }

        if (!badge && !loading) {
            return <ErrorPage title={T.translate("preview.error_retrieving")} message={T.translate("preview.contact_help")} onLinkClick={this.goToFindTicketPage} />;
        }

        const badgeObj = new Badge(badge);

        return (
            <div className="container print-page-wrapper">
                { badgeAllowedViewTypes &&
                    badgeAllowedViewTypes.length > 1 &&
                        (this.isBatchPrinting() ? !autoProcessBatch : true) &&
                <>
                    <div className="row">
                        <div className="col-md-4 col-md-offset-5">
                            <ButtonToolbar>
                                <ToggleButtonGroup
                                    type="radio"
                                    name="options"
                                    onChange={this.handleViewTypeChange}
                                    // TODO: badgeViewType not always present, assume default viewType
                                    value={
                                        Number(
                                            badgeViewType || 
                                            badgeAllowedViewTypes.find((viewType) => viewType.is_default)?.id
                                        )
                                    }
                                >
                                { badgeAllowedViewTypes.map((viewType) => (
                                    <ToggleButton
                                        key={viewType.id}
                                        id={`view-type-${viewType.id}`}
                                        type="radio"
                                        name="radio"
                                        value={viewType.id}
                                        disabled={!!viewTypeOverride}
                                    >
                                        {viewType.name}
                                    </ToggleButton>
                                )) }
                                </ToggleButtonGroup>
                            </ButtonToolbar>
                        </div>

                    </div>
                    <br/>
                </>
                }
                <div className="badge-wrapper">
                    {badgeObj.renderTemplate(summitSlug)}
                </div>
                { !this.isBatchPrinting() &&  
                <div className="row print-buttons-wrapper">
                    <div className="col-md-4 col-md-offset-4">
                        <button className="btn btn-primary" onClick={() => this.handlePrint(this.goToThankYou)}>
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
                        <button className="btn btn-primary" onClick={() => this.handlePrint()}>
                            {T.translate("Print")}
                        </button>
                    </div>
                    <div className="col-md-1">
                        <button className="btn btn-primary" disabled={this.isLastOfBatch()} onClick={() => this.goToNextBadge()}>
                            {T.translate(">")}
                        </button>
                    </div>
                </div>
                }
            </div>
        );
    };
}

const mapStateToProps = ({ baseState }) => ({
    loading: baseState.loading,
    badge: baseState.badge,
    badgeTicketId: baseState.badge?.ticket.id,
    badgeAllowedViewTypes: baseState.badge?.type.allowed_view_types,
    badgeViewType: baseState.badgeViewType,
});

export default connect(mapStateToProps, {
    getAllTickets,
    getBadge,
    incrementBadgePrintCount,
    printBadge,
    clearBadge
})(PrintPage)
