import React from 'react';
import {doLogin, getBackURL, initLogOut} from "openstack-uicore-foundation/lib/methods";
import {connect} from "react-redux";
import T from "i18n-react/dist/i18n-react";


class LoginPage extends React.Component {

    onClickLogin() {
        doLogin('/check-in');
    };

    render(){
        let {initLogOut, match} = this.props;

        return (
            <main id="page-wrap">
                <div className="container">
                    <div className="login-page">
                        <div className="login-message">{T.translate("general.login_message")}</div>
                        <button className="btn btn-primary btn-lg" onClick={this.onClickLogin}>
                            Log In
                        </button>
                    </div>
                </div>
            </main>
        );
    }
}

const mapStateToProps = ({ baseState }) => ({
    ...baseState
});

export default connect(mapStateToProps, {
    doLogin,
    initLogOut,
    getBackURL
})(LoginPage)
