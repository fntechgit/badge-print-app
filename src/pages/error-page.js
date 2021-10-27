import React from 'react';
import {connect} from "react-redux";

class ErrorPage extends React.Component {

    render(){
        let {summit} = this.props;
        let title = this.props.hasOwnProperty('title') ? this.props.title : "There's been an error";
        let message = this.props.hasOwnProperty('message') ? this.props.message : 'Please contact admin.';
        let path = summit && summit.slug || ''

        return (
            <div className="error_page_wrapper container">
                <h1>{title}</h1>
                <h3>{message}</h3>
                <br/>
                <a className="go-back" href={`/check-in/${path}`}> Go Back </a>
            </div>
        );
    }
}

const mapStateToProps = ({ baseState }) => ({
    ...baseState
});

export default connect(mapStateToProps, {})(ErrorPage)
