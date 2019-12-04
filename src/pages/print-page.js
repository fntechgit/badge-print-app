import React from 'react';
import {connect} from "react-redux";
import {getBadge} from "../actions/base-actions";
import Badge from '../model/badge';
import ErrorPage from './error-page'


class PrintPage extends React.Component {

    constructor(props) {
        super(props);
        this.qs = require('query-string');
    }

    componentDidMount() {
        let summitId = this.props.match.params.summit_id;
        let ticketId = this.props.match.params.ticket_id;

        let accessToken = this.qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).access_token;

        this.props.getBadge(summitId, ticketId, accessToken);
    }

    render(){
        let {badge, match, location, loading, size} = this.props;
        let accessToken = this.qs.parse(location.search, { ignoreQueryPrefix: true }).access_token;

        if (loading) return (<div>Loading badge</div>);

        if (!match.params.summit_id || !match.params.ticket_id) {
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
                    {badgeObj.renderTemplate(size)}
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
