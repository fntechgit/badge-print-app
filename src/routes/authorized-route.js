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

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import LoginPage from '../pages/login-page';
import {connect} from "react-redux";
import {setAccessTokenQS} from "../actions/base-actions";


class AuthorizedRoute extends React.Component {

    constructor(props) {
        super(props);
        this.qs = require('query-string');
    }

    componentWillMount() {
        let accessToken = this.qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).access_token;
        this.props.setAccessTokenQS(accessToken);
    }

    render() {
        let { component: Component, isLoggedUser, backUrl, accessTokenQS, loading, ...rest } = this.props;

        return (
            <Route {...rest} render={props => {
                if (isLoggedUser || accessTokenQS) {
                    return (<Component {...props} />);
                } else {
                    return (<LoginPage {...props} />);
                }
            }} />
        )
    }
}

const mapStateToProps = ({ loggedUserState, baseState }) => ({
    isLoggedUser: loggedUserState.isLoggedUser,
    backUrl: loggedUserState.backUrl,
    member: loggedUserState.member,
    ...baseState
});

export default connect(mapStateToProps, {
    setAccessTokenQS
})(AuthorizedRoute)


