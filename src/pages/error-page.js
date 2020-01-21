import React from 'react';
import {connect} from "react-redux";

class ErrorPage extends React.Component {

    render(){
        let {summit} = this.props;
        let message = this.props.hasOwnProperty('message') ? this.props.message : 'Please contact admin.';

        return (
            <div className="error_page_wrapper container">
                <h1>There's been an error</h1>
                <h3>{message}</h3>

                <a className="go-back" href={`/check-in/${summit.slug}`}> Go Back </a>
            </div>
        );
    }
}

const mapStateToProps = ({ baseState }) => ({
    ...baseState
});

export default connect(mapStateToProps, {})(ErrorPage)
