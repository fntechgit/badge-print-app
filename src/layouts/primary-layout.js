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
import {Switch, Route} from 'react-router-dom';
import PrintProvider, {NoPrint} from "react-easy-print";
import SummitLayout from "./summit-layout";
import NoMatchPage from "../pages/no-match-page";
import SelectSummitPage from "../pages/select-summit-page";


class PrimaryLayout extends React.Component {

    render(){
        let { match, badge } = this.props;

        return(
            <div className="primary-layout">
                <main id="page-wrap">
                    <PrintProvider>
                        <NoPrint>
                            <Switch>
                                <Route strict exact path={match.url} component={SelectSummitPage} />
                                <Route path={`${match.url}/:summit_slug`} component={SummitLayout} />
                                <Route component={NoMatchPage} />
                            </Switch>
                        </NoPrint>
                    </PrintProvider>
                </main>
            </div>
        );
    }

}

const mapStateToProps = ({ baseState, loggedUserState }) => ({
    badge: baseState.badge,
    member: loggedUserState.member
});

export default connect(mapStateToProps, {})(PrimaryLayout)


