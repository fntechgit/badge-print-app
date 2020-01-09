import React from 'react';
import {doLogin, getBackURL, initLogOut} from "openstack-uicore-foundation/lib/methods";
import {connect} from "react-redux";

class LoginPage extends React.Component {

    onClickLogin() {
        doLogin('/check-in');
    };

    render(){
        let {initLogOut, match} = this.props;

        return (
            <div className="container">
                <div className="login">
                    You are not logged in. Please log in to continue:
                    <br/><br/>
                    <button className="btn btn-primary btn-lg" onClick={this.onClickLogin}>
                        Log In
                    </button>
                </div>
            </div>
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
