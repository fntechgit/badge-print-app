import React from 'react';

export default class NoMatchPage extends React.Component {

    render(){
        return (
            <div className="no_match_page_wrapper container">
                <h1>YOU JUST GOT 404'D</h1>
                <h3>This URL does not match any page.</h3>
            </div>
        );
    }
}
