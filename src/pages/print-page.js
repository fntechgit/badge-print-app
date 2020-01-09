import React from 'react';
import {connect} from "react-redux";
import {getBadge} from "../actions/badge-actions";
import Badge from '../model/badge';
import ErrorPage from './error-page'

import '../styles/badge-common.less'


class PrintPage extends React.Component {

    constructor(props) {
        super(props);
        this.qs = require('query-string');
    }

    componentDidMount() {
        let summitSlug = this.props.match.params.summit_slug;
        let ticketId = this.props.match.params.ticket_id;

        let accessToken = this.qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).access_token;

        this.props.getBadge(summitSlug, ticketId, accessToken);
    }

    render(){
        let {badge, match, location, loading, summitSlug} = this.props;
        let accessToken = this.qs.parse(location.search, { ignoreQueryPrefix: true }).access_token;

        if (loading) return (<div>Loading badge</div>);

        if (!match.params.summit_slug || !match.params.ticket_id) {
            return (<ErrorPage message="Summit or Ticket missing in url" />);
        }

        if (!accessToken) {
            return (<ErrorPage message="Access Token missing in url" />);
        }

        if (!badge && !loading) {
            return (<ErrorPage message="Cannot retrieve badge." />);
        }

        let badgeObj = new Badge(badge);

        return (
            <div className="container print-page-wrapper">
                <div className="badge-wrapper">
                    {badgeObj.renderTemplate(summitSlug)}
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
})(PrintPage)
