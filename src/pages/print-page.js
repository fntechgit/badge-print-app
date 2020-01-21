import React from 'react';
import {connect} from "react-redux";
import history from '../history';
import T from "i18n-react/dist/i18n-react";
import {getBadge} from "../actions/badge-actions";
import Badge from '../model/badge';
import ErrorPage from './error-page'

import '../styles/badge-common.less'
import '../styles/print-page.less'

class PrintPage extends React.Component {

    constructor(props) {
        super(props);
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
        let summitSlug = this.props.match.params.summit_slug;

        window.print();
        history.push(`/check-in/${summitSlug}/thank-you`);
    };

    render(){
        let {badge, match, location, loading, summitSlug, accessToken, accessTokenQS} = this.props;

        if (loading) return (<div className="loading-badge">{T.translate("preview.loading")}</div>);

        console.log(loading);

        if (!match.params.summit_slug || !match.params.ticket_id) {
            return (<ErrorPage message={T.translate("preview.summit_missing")} />);
        }

        if (!accessToken && !accessTokenQS) {
            return (<ErrorPage message={T.translate("preview.token_missing")} />);
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


const mapStateToProps = ({ baseState, loggedUserState }) => ({
    accessToken: loggedUserState.accessToken,
    ...baseState
});

export default connect(mapStateToProps, {
    getBadge,
})(PrintPage)
