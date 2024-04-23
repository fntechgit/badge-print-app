import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import history from "../history";
import qs from "query-string";
import T from "i18n-react/dist/i18n-react";
import {
    getBadge,
    incrementBadgePrintCount,
    clearBadge,
    printBadge
} from "../actions/badge-actions";
import { getAllTickets } from "../actions/ticket-actions";
import Timeout from "../components/Timeout";
import Badge from "../model/badge";
import ErrorPage from "./error-page";

import {
    ButtonToolbar,
    ToggleButtonGroup,
    ToggleButton
} from "react-bootstrap";

import "../styles/badge-common.less";
import "../styles/print-page.less";

const RedirectTimeOut = 7000;

const PrintStatus = {
    NotPrinted: "NotPrinted",
    Printed: "Printed",
    Error: "Error",
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
    oneViewTypePrintRemaining() {
        return this.printStatuses.filter(
            (printStatus) => printStatus == PrintStatus.NotPrinted
        ).length == 1;
    }
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
        const { ticket_id: ticketId } = this.props.match.params;

        const parsedQueryString = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });

        const viewType = parsedQueryString["view_type"];
        const checkIn = parsedQueryString["check_in"];
        const filters = !ticketId ? parsedQueryString["filter[]"] : `id==${ticketId}`;
        const order = parsedQueryString["order"];

        const newState = { ...this.state };
        newState.summitSlug = summitSlug;

        if (viewType) newState.viewTypeOverride = viewType;
        if (checkIn) newState.willCheckIn = (checkIn === "true");
        console.log(`PrintPage::componentWillMount viewType ${viewType} checkIn ${checkIn}`);

        this.setState(newState, () => {
            this.props.getAllTickets({
                filters,
                order,
                expand: "badge,badge.type,badge.type.allowed_view_types"
            }).then((tickets) => this.initPrintJob(tickets));
        });
    };

    componentDidMount = () => {
        this.getBadge();
    };

    componentDidUpdate = (prevProps) => {
        this.getBadge(prevProps);
    };

    getBadge = (prevProps = null) => {
        const { summitSlug, viewTypeOverride } = this.state;
        const { ticket_id: ticketId, view_type: viewType } = this.props.match.params;

        let shouldGetBadge = !!ticketId && !!viewType;
        if (prevProps) {
            const { ticket_id: prevTicketId, view_type: prevViewType } = prevProps.match.params;
            shouldGetBadge &&=
                ticketId != prevTicketId ||
                    (ticketId == prevTicketId && viewType != prevViewType);
        }
        if (shouldGetBadge) {
            this.props.getBadge(summitSlug, ticketId, viewTypeOverride || viewType);
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
        const [prevTicketId, prevViewType] = batchItemsRef[prevIndex].split("|");

        history.push(`/check-in/${summitSlug}/tickets/${prevTicketId}/views/${prevViewType}`);
    };

    goToNextBadge = (printStatus = null) => {
        const {
            embedded,
            summitSlug,
            batchItemsRef,
            printJobStatus,
            viewTypeOverride
        } = this.state;

        const { badgeTicketId, badgeViewType } = this.props;

        const currentIndex = batchItemsRef.indexOf(`${badgeTicketId}|${badgeViewType}`);
        let nextIndex = currentIndex == batchItemsRef.length - 1 ? 0 : currentIndex + 1;
        let [nextTicketId, nextViewType] = batchItemsRef[nextIndex].split("|");

        if (printStatus == PrintStatus.NotPrinted) {
            if (this.isBatchPrintingComplete()) {
                this.setState({ batchPrintingComplete: true }, this.goToThankYou);
                return;
            }
            while (printJobStatus[nextTicketId].isViewTypePrinted(nextViewType)) {
                nextIndex = nextIndex == batchItemsRef.length - 1 ? 0 : nextIndex + 1;
                [nextTicketId, nextViewType] = batchItemsRef[nextIndex].split("|");
            }
        }

        history.push(`/check-in/${summitSlug}/tickets/${nextTicketId}/views/${nextViewType}`);
    };

    goToThankYou = () => {
        this.props.clearBadge().then(() =>
            history.push(`/check-in/${this.state.summitSlug}/thank-you`)
        )
    };

    goToFindTicketPage = () => {
        this.props.clearBadge().then(() =>
            history.push(`/check-in/${this.state.summitSlug || ""}`)
        )
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

    toggleAutoProcessBatch = () => {
        this.setState({ autoProcessBatch: !this.state.autoProcessBatch });
    };

    processBatch = () => {
        if (this.isBatchPrintingComplete()) {
            this.setState({ batchPrintingComplete: true }, this.goToThankYou);
            return;
        }
        const { printJobStatus } = this.state;
        const { badgeTicketId, badgeViewType } = this.props;
        if (!printJobStatus[badgeTicketId].isViewTypePrinted(badgeViewType)) {
            this.handlePrint(null,
                () => setTimeout(() => this.goToNextBadge(PrintStatus.NotPrinted), RedirectTimeOut)
            );
        } else {
            this.goToNextBadge(PrintStatus.NotPrinted);
        }
    };

    handlePrint = (event = null, callback = () => {}) => {
        if (!(callback instanceof Function)) throw Error;
        const afterPrint = () => {
            if (event?.target) event.target.disabled = false;
            if (this.isBatchPrinting()) {
                const { embedded, printJobStatus, autoProcessBatch } = this.state;
                const { badgeTicketId, badgeViewType } = this.props;
                const newPrintJobStatus = { ...printJobStatus };
                newPrintJobStatus[badgeTicketId][badgeViewType] = PrintStatus.Printed;
                // if running embedded, we make it auto process batch
                this.setState({
                    printJobStatus: newPrintJobStatus,
                    autoProcessBatch: embedded ? true : autoProcessBatch
                }, callback);
            }
        };
        const { printJobStatus } = this.state;
        const { badgeTicketId } = this.props;
        // we should only checkin on last view type print
        const bypassCheckIn = !printJobStatus[badgeTicketId].oneViewTypePrintRemaining();
        if (this.state.embedded) {
            if (event?.target) event.target.disabled = true;
            const { view_type: badgeViewType } = this.props.match.params;
            const element = document.getElementById("badge-artboard");
            const payload = {
                height: element.clientHeight,
                width: element.clientWidth,
                view: badgeViewType ?? "Card",
            };
            // call native printing then increment count
            this.props.printBadge(payload).then(() =>
                this.incrementPrintCount(bypassCheckIn).then(afterPrint)
            );
        } else {
            this.incrementPrintCount(bypassCheckIn).then(() => {
                // print after incrementing count
                window.print();
                afterPrint();
            });
        }
    };

    incrementPrintCount = (bypassCheckIn = false) => {
        const { summitSlug, willCheckIn } = this.state;
        const { badgeTicketId, badgeViewType } = this.props;
        console.log(`PrintPage::incrementPrintCount summitSlug ${summitSlug} ticketId ${badgeTicketId} viewType ${badgeViewType} checkIn ${willCheckIn && !bypassCheckIn}`);
        return this.props.incrementBadgePrintCount(summitSlug, badgeTicketId, badgeViewType, willCheckIn && !bypassCheckIn);
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
            embedded
        } = this.state;

        const { loading, badge, badgeTicketId, badgeAllowedViewTypes, badgeViewType, marketingSettings } = this.props;
        const { ticket_id: urlTicketId, view_type: urlViewType } = this.props.match.params;

        if (summitSlug && (!urlTicketId || urlTicketId && !urlViewType) && this.isBatchPrinting()) {
            const [ticketId, viewType] = batchItemsRef[0].split("|");
            return <Redirect to={`/check-in/${summitSlug}/tickets/${ticketId}/views/${viewType}`} />;
        }

        if (loading) return (<div className="loading-badge">{T.translate("preview.loading")}</div>);

        if (!summitSlug || !urlTicketId) {
            return <ErrorPage message={T.translate("preview.summit_missing")} onLinkClick={this.goToFindTicketPage} />;
        }

        if (!badge && !loading) {
            return <ErrorPage title={T.translate("preview.error_retrieving")} message={T.translate("preview.contact_help")} onLinkClick={this.goToFindTicketPage} />;
        }

        const viewTypeId = badgeViewType || badgeAllowedViewTypes.find((viewType) => viewType.is_default)?.id;
        const viewTypeName = badgeAllowedViewTypes.find((viewType) => viewType.id == viewTypeId)?.name;
        const badgeObj = new Badge(badge);
        
        return (
            <div className="container print-page-wrapper">
                { !embedded && this.isBatchPrinting() &&
                <>
                    { batchItemsRef.indexOf(`${badgeTicketId}|${badgeViewType}`) + 1}
                    /
                    { batchItemsRef.length }
                </>
                }
                { this.isBatchPrinting() && !autoProcessBatch && !batchPrintingComplete &&
                <div className="row print-buttons-wrapper">
                    <div className="col-md-1 col-md-offset-3">
                        { !embedded &&
                        <button className="btn btn-danger" disabled={this.isFirstOfBatch()} onClick={this.goToPrevBadge}>
                            {T.translate("<")}
                        </button>
                        }
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-danger" onClick={this.goToFindTicketPage}>
                          {T.translate("preview.cancel")}
                        </button>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary" onClick={this.handlePrint}>
                            {T.translate("Print")}
                        </button>
                    </div>
                    <div className="col-md-1">
                        { !embedded &&
                        <button className="btn btn-primary" disabled={this.isLastOfBatch()} onClick={this.goToNextBadge}>
                            {T.translate(">")}
                        </button>
                        }
                    </div>
                </div>
                }
                { !embedded && this.isBatchPrinting() && !batchPrintingComplete &&
                <div className="row print-buttons-wrapper">
                    <div className="col-md-2 col-md-offset-5">
                        <label>
                            <input type="checkbox" checked={autoProcessBatch} onChange={this.toggleAutoProcessBatch} />
                            <span>&nbsp; auto process batch</span>
                        </label>
                    </div>
                </div>
                }
                { this.isBatchPrinting() && !batchPrintingComplete &&
                <Timeout callback={this.processBatch} paused={!autoProcessBatch} />
                }
                <div className="badge-wrapper">
                    {badgeObj.renderTemplate(summitSlug, viewTypeName, marketingSettings)}
                </div>
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
    marketingSettings: baseState.marketingSettings
});

export default connect(mapStateToProps, {
    getAllTickets,
    getBadge,
    incrementBadgePrintCount,
    printBadge,
    clearBadge
})(PrintPage)
