
import React from 'react'
import { connect } from 'react-redux'
import { Switch, Redirect, Router } from 'react-router-dom'
import PrimaryLayout from "./layouts/primary-layout"
import { AjaxLoader, OPSessionChecker } from "openstack-uicore-foundation/lib/components";
import { onUserAuth, doLogout, getUserInfo, initLogOut } from "openstack-uicore-foundation/lib/methods";
import history from './history'
import AuthorizedRoute from './routes/authorized-route';
import AuthorizationCallbackRoute from "./routes/authorization-callback-route";
import LogOutCallbackRoute from './routes/logout-callback-route';
import { clearBadge } from "./actions/badge-actions";
import T from 'i18n-react';
import LanguageSelect from './components/language-select'


// move all env var to global scope so ui core has access to this
window.IDP_BASE_URL        = process.env['IDP_BASE_URL'];
window.API_BASE_URL        = process.env['API_BASE_URL'];
window.OAUTH2_CLIENT_ID    = process.env['OAUTH2_CLIENT_ID'];
window.SCOPES              = process.env['SCOPES'];
window.ALLOWED_USER_GROUPS = process.env['ALLOWED_USER_GROUPS'];

// here is set by default user lang as en

let language = localStorage.getItem('PREFERRED_LANGUAGE');

if (!language) {
    language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;

    // language would be something like es-ES or es_ES
    // However we store our files with format es.json or en.json therefore retrieve only the first 2 digits

    if (language.length > 2) {
        language = language.split("-")[0];
        language = language.split("_")[0];
    }
}

try {
    T.setTexts(require(`./i18n/${language}.json`));
} catch (e) {
    T.setTexts(require(`./i18n/en.json`));
}


class App extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.clearBadge();
    }

    render() {
        let { loading, summit, isLoggedUser, onUserAuth, doLogout, getUserInfo, member, backUrl } = this.props;
        let title = 'Badge Printing App';

        if (summit) {
            title = summit.name;
        }

        return (
            <Router history={history}>
                <div>
                    <AjaxLoader show={ loading } size={ 120 }/>
                    {isLoggedUser &&
                    <OPSessionChecker
                        clientId={window.OAUTH2_CLIENT_ID}
                        idpBaseUrl={window.IDP_BASE_URL}
                    />
                    }

                    <div className="header">
                        <div className="header-title row">
                            <div className="col-md-12 title">
                                {title}
                                <a className="logout pull-right" onClick={() => { initLogOut(); }}>
                                    <i className="fa fa-sign-out" aria-hidden="true"></i>
                                </a>
                                <LanguageSelect language={language} />
                            </div>
                            <div className="col-md-2">

                            </div>
                        </div>
                    </div>

                    <Switch>
                        <AuthorizedRoute isLoggedUser={isLoggedUser} backUrl={backUrl} path="/check-in" component={PrimaryLayout} />
                        <AuthorizationCallbackRoute onUserAuth={onUserAuth} path='/auth/callback' getUserInfo={getUserInfo} />
                        <LogOutCallbackRoute doLogout={doLogout}  path='/auth/logout'/>
                        <Redirect to="/check-in" />
                    </Switch>
                </div>
            </Router>
        );
    }
}

const mapStateToProps = ({ loggedUserState, baseState }) => ({
    isLoggedUser: loggedUserState.isLoggedUser,
    backUrl: loggedUserState.backUrl,
    member: loggedUserState.member,
    ...baseState
});

export default connect(mapStateToProps, {
    initLogOut,
    onUserAuth,
    doLogout,
    getUserInfo,
    clearBadge
})(App)
