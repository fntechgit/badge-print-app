import React from 'react';
import {connect} from "react-redux";
import history from '../history';

class ErrorPage extends React.Component {

    onLinkClick = (e) => {
        if (this.props.onLinkClick) {
            e.preventDefault();
            this.props.onLinkClick();
        }
    }

    render(){
        const { summit } = this.props;
        const title = this.props.title || "There's been an error";
        const message = this.props.message || 'Please contact admin.';
        const linkText = this.props.linkText || 'Go Back';
        const path = summit && summit.slug || ''

        return (
            <div className="error_page_wrapper container">
                <h1>{title}</h1>
                <p>{message}</p>
                <br/>
                <a href={`/check-in/${path}`} className="go-back" onClick={this.onLinkClick}>{linkText}</a>
            </div>
        );
    }
}

const mapStateToProps = ({ baseState }) => ({
    ...baseState
});

export default connect(mapStateToProps, {})(ErrorPage)
