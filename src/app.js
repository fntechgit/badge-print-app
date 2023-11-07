
import React from 'react';
import { connect } from 'react-redux';
import { Switch, Redirect, Router, Route } from 'react-router-dom';
import PrimaryLayout from './layouts/primary-layout';
import AjaxLoader  from 'openstack-uicore-foundation/lib/components/ajaxloader';
import { resetLoading } from "openstack-uicore-foundation/lib/utils/actions";
import { onUserAuth, doLogout, getUserInfo } from 'openstack-uicore-foundation/lib/security/actions';
import { initLogOut } from 'openstack-uicore-foundation/lib/security/methods';
import history from './history';
import AuthorizedRoute from './routes/authorized-route';
import AuthorizationCallbackRoute from './routes/authorization-callback-route';
import LogOutCallbackRoute from './routes/logout-callback-route';
import { clearBadge } from "./actions/badge-actions";
import T from 'i18n-react';
import LanguageSelect from './components/language-select';
import * as Sentry from "@sentry/react";


// move all env var to global scope so ui core has access to this
window.IDP_BASE_URL        = process.env['IDP_BASE_URL'];
window.API_BASE_URL        = process.env['API_BASE_URL'];
window.OAUTH2_FLOW         = process.env['OAUTH2_FLOW'];
window.OAUTH2_CLIENT_ID    = process.env['OAUTH2_CLIENT_ID'];
window.SCOPES              = process.env['SCOPES'];
window.ALLOWED_USER_GROUPS = process.env['ALLOWED_USER_GROUPS'];
window.MARKETING_API_BASE_URL = process.env['MARKETING_API_BASE_URL'];
window.SENTRY_DSN          = process.env['SENTRY_DSN'];
window.SENTRY_TRACE_SAMPLE_RATE = process.env['SENTRY_TRACE_SAMPLE_RATE'];
// admin groups allowed to bypass user checks on find and select ticket pages
export const ADMIN_GROUPS = ['super-admins', 'administrators'];

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

// Create Custom Sentry Route component
export const SentryRoute = Sentry.withSentryRouting(Route);

// Initialize Sentry
Sentry.init({
    dsn: window.SENTRY_DSN,
    beforeSend(event) {
        // Modify the event here
        console.log('before send...', event)
        return event;
    },
    integrations: [
      new Sentry.BrowserTracing({
        // See docs for support of different versions of variation of react router
        // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
        routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ["localhost"],
      }),
      new Sentry.Replay()
    ],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    tracesSampleRate: window.SENTRY_TRACE_SAMPLE_RATE,
  
    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

class App extends React.PureComponent {
    constructor(props) {
        super(props);
        props.resetLoading();
    }

    componentDidMount() {
        this.props.clearBadge();
    }

    render() {
        const {
            loading,
            summit,
            isLoggedUser,
            onUserAuth,
            doLogout,
            getUserInfo
        } = this.props;
        const title = (summit) ? summit.name : T.translate("general.app_title");
        const summit_logo = summit ? summit.logo : null;
        return (
            <Router history={history}>
                <div>
                    <AjaxLoader show={loading} size={ 120 }/>
                    <div className="header">
                        <div className="header-title row">
                            <div className="col-md-12 title">
                                <LanguageSelect language={language} />
                                { summit_logo &&
                                    <img alt="logo" className="header-logo" src={summit_logo} />
                                }
                                { !summit_logo &&
                                     title
                                }
                                { isLoggedUser &&
                                <a className="logout pull-right" onClick={initLogOut}>
                                    <i className="fa fa-sign-out" aria-hidden="true" />
                                </a>
                                }
                            </div>
                        </div>
                    </div>
                    <Switch>
                        <AuthorizedRoute path="/check-in" component={PrimaryLayout} />
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
    ...baseState
});

export default connect(mapStateToProps, {
    onUserAuth,
    doLogout,
    getUserInfo,
    clearBadge,
    resetLoading
})(App)
