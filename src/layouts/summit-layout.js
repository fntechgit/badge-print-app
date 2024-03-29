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
import {getSummit, getMarketingSettings, clearSummit} from '../actions/base-actions';
import FindTicketPage from '../pages/find-ticket-page';
import ExtraQuestionsPage from '../pages/extra-questions-page';
import SelectTicketPage from '../pages/select-ticket-page';
import PrintPage from '../pages/print-page';
import ThankYouPage from '../pages/thank-you-page';
import NoMatchPage from '../pages/no-match-page';
import T from "i18n-react";
import ErrorPage from "../pages/error-page";

class SummitLayout extends React.Component {

    componentDidMount() {
        const { summit, match } = this.props;
        const summitSlug = match.params.summit_slug;

        if (!summit || !summit.id || summitSlug !== summit.slug) {
            this.props.getSummit(summitSlug).then((newSummit) => this.props.getMarketingSettings(newSummit.id)).catch(() => {
                this.props.clearSummit()
            });
        } else {
            this.props.getMarketingSettings(summit.id);
        }
    }

    render() {
        const { match, summit, loading } = this.props;
        const summitSlug = match.params.summit_slug;

        if (!summit && loading) return (<div className="loading-badge">{T.translate("preview.loading")}</div>);

        if (!summit || !summit.id || summitSlug !== summit.slug) {
            return (<ErrorPage message={T.translate("errors.summit_not_found")} />);
        }

        return(
            <div>
                <Switch>
                    <Route exact strict path={match.url} component={FindTicketPage} />
                    <Route exact strict path={`/check-in/:summit_slug/extra-questions`} component={ExtraQuestionsPage} />
                    <Route exact strict path={`/check-in/:summit_slug/select-ticket`} component={SelectTicketPage} />
                    <Route exact path={`/check-in/:summit_slug/tickets`} component={PrintPage} />
                    <Route exact strict path={`/check-in/:summit_slug/tickets/:ticket_id`} component={PrintPage} />
                    <Route exact strict path={`/check-in/:summit_slug/tickets/:ticket_id/views/:view_type`} component={PrintPage} />
                    <Route path={`${match.url}/thank-you`} component={ThankYouPage} />
                    <Route component={NoMatchPage} />
                </Switch>
            </div>
        );
    }

}

const mapStateToProps = ({ baseState }) => ({
    summit: baseState.summit,
    loading: baseState.loading
});

export default connect(mapStateToProps, {
    getSummit,
    getMarketingSettings,
    clearSummit,
})(SummitLayout);
