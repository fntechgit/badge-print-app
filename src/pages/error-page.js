import React from 'react';

export default class ErrorPage extends React.Component {

    render(){
        let message = this.props.hasOwnProperty('message') ? this.props.message : 'Please contact admin.';

        return (
            <div className="error_page_wrapper container">
                <h1>There's been an error</h1>
                <h3>{message}</h3>
            </div>
        );
    }
}
