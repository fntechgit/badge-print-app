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

const RedirectTimeOut = 2000;

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
            summitSlug: props.match.params.summit_slug,
            willCheckIn: true,
            printJob: [],
            printJobTicketStatus: {},
            viewTypeOverride: null,
            autoPrintMode: false,
            printJobComplete: false,
            retrievingTickets: false,
            errorRetrievingBadge: false,
            errorRetrievingTickets: false
        };
        this.isFirstInPrintJob = this.isFirstInPrintJob.bind(this);
        this.isLastInPrintJob = this.isLastInPrintJob.bind(this);
    };

    initPrintJob = (tickets) => {
        const { viewTypeOverride } = this.state;
        // linear representation of all ticket view types variations, unless viewTypeOverride
        // format "ticketId|viewType"
        const printJob = [];
        const printJobTicketStatus = {};
        tickets.forEach((ticket) => {
            if (viewTypeOverride) {
                printJob.push(`${ticket.id}|${viewTypeOverride}`);
                printJobTicketStatus[ticket.id] = Object.create(TicketStatusPrototype);
                printJobTicketStatus[ticket.id].init([viewTypeOverride]);
            } else {
                const { allowed_view_types: allowedViewTypes } = ticket.badge?.type;
                const viewTypes = allowedViewTypes.map((viewType) => viewType.id);
                viewTypes.forEach((viewType) => printJob.push(`${ticket.id}|${viewType}`));
                printJobTicketStatus[ticket.id] = Object.create(TicketStatusPrototype);
                printJobTicketStatus[ticket.id].init(viewTypes);
            }
        }); 
        this.setState({ printJob, printJobTicketStatus });
    };

    componentWillMount = () => {
        const { ticket_id: ticketId } = this.props.match.params;

        const parsedQueryString = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });

        const viewType = parsedQueryString["view_type"];
        const checkIn = parsedQueryString["check_in"];
        const filters = !ticketId ? parsedQueryString["filter[]"] : `id==${ticketId}`;
        const order = parsedQueryString["order"];

        const newState = { ...this.state };
        newState.retrievingTickets = true;
        if (viewType) newState.viewTypeOverride = viewType;
        if (checkIn) newState.willCheckIn = (checkIn === "true");
        console.log(`PrintPage::componentWillMount viewType ${viewType} checkIn ${checkIn}`);

        this.setState(newState, () => {
            const newState = { retrievingTickets: false };
            this.props.getAllTickets({
                filters,
                order,
                expand: "badge,badge.type,badge.type.allowed_view_types"
            }).then((tickets) => {
                if (tickets?.length == 0) {
                    if (ticketId) {
                        newState.errorRetrievingBadge = true;
                    } else {
                        newState.errorRetrievingTickets = true;
                    }
                    this.setState(newState);
                    return;
                }
                this.setState(newState, () => this.initPrintJob(tickets));
            }).catch((e) => this.setState({ ...newState, errorRetrievingTickets: true }));
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
            this.setState({ errorRetrievingBadge: false }, () => {
                const chosenViewType = viewTypeOverride || viewType;
                this.props.getBadge(summitSlug, ticketId, chosenViewType).catch((e) =>
                    this.setState({ errorRetrievingBadge: true })
                );
            });
        }
    };

    goToPrevBadge = () => {
        const {
            summitSlug,
            printJob,
            printJobTicketStatus,
            viewTypeOverride
        } = this.state;

        const { badgeTicketId, badgeViewType } = this.props;

        const currentIndex = printJob.indexOf(`${badgeTicketId}|${badgeViewType}`);
        const prevIndex = currentIndex == 0 ? printJob.length - 1 : currentIndex - 1;
        const [prevTicketId, prevViewType] = printJob[prevIndex].split("|");

        history.push(`/check-in/${summitSlug}/tickets/${prevTicketId}/views/${prevViewType}`);
    };

    goToNextBadge = (printStatus = null) => {
        const {
            embedded,
            summitSlug,
            printJob,
            printJobTicketStatus,
            viewTypeOverride
        } = this.state;

        const { badgeTicketId, badgeViewType } = this.props;

        const currentIndex = printJob.indexOf(`${badgeTicketId}|${badgeViewType}`);
        let nextIndex = currentIndex == printJob.length - 1 ? 0 : currentIndex + 1;
        let [nextTicketId, nextViewType] = printJob[nextIndex].split("|");

        if (printStatus == PrintStatus.NotPrinted) {
            if (this.isPrintJobComplete()) {
                this.setState({ printJobComplete: true }, this.goToThankYou);
                return;
            }
            while (printJobTicketStatus[nextTicketId].isViewTypePrinted(nextViewType)) {
                nextIndex = nextIndex == printJob.length - 1 ? 0 : nextIndex + 1;
                [nextTicketId, nextViewType] = printJob[nextIndex].split("|");
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

    isPrintJobInitialized = () => this.state.printJob.length > 0;

    isPrintJobComplete = () => {
        const { printJobTicketStatus } = this.state;
        return Object.values(printJobTicketStatus)
            .every((ticketStatus) => ticketStatus.areViewTypesPrinted()
        );
    };

    isFirstInPrintJob = () => {
        const { printJob } = this.state;
        const { badgeTicketId, badgeViewType } = this.props;
        return printJob.indexOf(`${badgeTicketId}|${badgeViewType}`) == 0;
    };

    isLastInPrintJob = () => {
        const { printJob } = this.state;
        const { badgeTicketId, badgeViewType } = this.props;
        return printJob.indexOf(`${badgeTicketId}|${badgeViewType}`) == printJob.length - 1;
    };

    toggleAutoPrintMode = () => {
        this.setState({ autoPrintMode: !this.state.autoPrintMode });
    };

    processPrintJob = () => {
        if (this.isPrintJobComplete()) {
            this.setState({ printJobComplete: true }, this.goToThankYou);
            return;
        }
        const { printJobTicketStatus } = this.state;
        const { badgeTicketId, badgeViewType } = this.props;
        if (!printJobTicketStatus[badgeTicketId].isViewTypePrinted(badgeViewType)) {
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
            const { embedded, printJobTicketStatus, autoPrintMode } = this.state;
            const { badgeTicketId, badgeViewType } = this.props;
            const newPrintJobStatus = { ...printJobTicketStatus };
            newPrintJobStatus[badgeTicketId][badgeViewType] = PrintStatus.Printed;
            // if running embedded, we set it to auto print mode
            // so it prints all view types
            this.setState({
                printJobTicketStatus: newPrintJobStatus,
                autoPrintMode: embedded ? true : autoPrintMode
            }, callback);
        };
        const { printJobTicketStatus } = this.state;
        const { badgeTicketId } = this.props;
        // we should only checkin on last view type print
        const bypassCheckIn = !printJobTicketStatus[badgeTicketId].oneViewTypePrintRemaining();
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

    render() {
        const {
            summitSlug,
            printJob,
            autoPrintMode,
            printJobComplete,
            viewTypeOverride,
            embedded,
            retrievingTickets,
            errorRetrievingBadge,
            errorRetrievingTickets
        } = this.state;

        const {
            loading,
            badge,
            badgeTicketId,
            badgeAllowedViewTypes,
            badgeViewType,
            marketingSettings
        } = this.props;

        const { ticket_id: urlTicketId, view_type: urlViewType } = this.props.match.params;

        if ((!urlTicketId || urlTicketId && !urlViewType) && this.isPrintJobInitialized()) {
            const [ticketId, viewType] = printJob[0].split("|");
            return <Redirect to={`/check-in/${summitSlug}/tickets/${ticketId}/views/${viewType}`} />;
        }

        if (errorRetrievingTickets) {
            return <ErrorPage message={T.translate("preview.error_retrieving_tickets")} onLinkClick={this.goToFindTicketPage} />;
        }

        if (!badge && errorRetrievingBadge) {
            return <ErrorPage title={T.translate("preview.error_retrieving_badge")} message={T.translate("preview.contact_help")} onLinkClick={this.goToFindTicketPage} />;
        }

        if (retrievingTickets) return (<div className="loading-badge">{T.translate("preview.loading_tickets")}</div>);
        if (loading || !badge) return (<div className="loading-badge">{T.translate("preview.loading_badge")}</div>);

        const viewTypeId = badgeViewType || badgeAllowedViewTypes.find((viewType) => viewType.is_default)?.id;
        const viewTypeName = badgeAllowedViewTypes.find((viewType) => viewType.id == viewTypeId)?.name;
        const badgeObj = new Badge(badge);
        
        return (
            <div className="container print-page-wrapper">
                { !embedded && this.isPrintJobInitialized() &&
                <div className="row">
                    <div className="col-md-6">
                    { printJob.indexOf(`${badgeTicketId}|${badgeViewType}`) + 1}
                    /
                    { printJob.length }
                    </div>
                    { !printJobComplete &&
                    <div className="col-md-6 text-right">
                        <label>
                            <input type="checkbox" checked={autoPrintMode} onChange={this.toggleAutoPrintMode} />
                            <span>&nbsp; auto print mode</span>
                        </label>
                        <Timeout callback={this.processPrintJob} paused={!autoPrintMode} />
                    </div>
                    }
                </div>
                }                
                { this.isPrintJobInitialized() && !autoPrintMode && !printJobComplete &&
                <div className="row print-buttons-wrapper">
                    <div className="col-md-1 col-md-offset-3">
                        { !embedded &&
                        <button className="btn btn-danger" disabled={this.isFirstInPrintJob()} onClick={this.goToPrevBadge}>
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
                        <button className="btn btn-primary" disabled={this.isLastInPrintJob()} onClick={this.goToNextBadge}>
                            {T.translate(">")}
                        </button>
                        }
                    </div>
                </div>
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
