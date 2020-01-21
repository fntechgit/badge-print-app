/**
 * Copyright 2019 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import React from 'react'
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { getSummit }  from '../actions/base-actions';
import FindTicketPage from '../pages/find-ticket-page';
import SelectTicketPage from '../pages/select-ticket-page';
import PrintPage from '../pages/print-page';
import ThankYouPage from '../pages/thank-you-page';
import NoMatchPage from '../pages/no-match-page';
import T from "i18n-react";
import ErrorPage from "../pages/error-page";

class SummitLayout extends React.Component {

    componentDidMount() {
        let {summit, match} = this.props;
        let summitSlug = match.params.summit_slug;

        if (!summit || !summit.id || summitSlug !== summit.slug) {
            this.props.getSummit(summitSlug);
        }
    }

    render(){
        let { match, summit } = this.props;
        let summitSlug = match.params.summit_slug;

        if (!summit || !summit.id || summitSlug !== summit.slug) {
            return (<ErrorPage message={T.translate("errors.summit_not_found")} />);
        }

        return(
            <div>
                <Switch>
                    <Route exact strict path={match.url} component={FindTicketPage} />
                    <Route exact strict path={`/check-in/:summit_slug/tickets`} component={SelectTicketPage} />
                    <Route exact strict path={`/check-in/:summit_slug/tickets/:ticket_id`} component={PrintPage} />
                    <Route path={`${match.url}/thank-you`} component={ThankYouPage} />
                    <Route component={NoMatchPage} />
                </Switch>
            </div>
        );
    }

}

const mapStateToProps = ({ baseState }) => ({
    summit   : baseState.summit
});

export default connect (
    mapStateToProps,
    {
        getSummit,
    }
)(SummitLayout);


