import React from 'react';
import T from "i18n-react/dist/i18n-react";
import history from '../history';
import {connect} from "react-redux";

import "../styles/thank-you-page.less"

class ThankYouPage extends React.Component {

    componentDidMount(prevProps, prevState, snapshot) {
        const { summit } = this.props;
        setTimeout(() => {history.push(`/check-in/${summit.slug}`)}, 4000);
    }

    render(){
        return (
            <div className="container thank-you-page">
                <div className="ty-title">{T.translate("general.thank_you")}!</div>
                <div className="ty-subtitle">blah blah</div>
            </div>
        );
    }
}

const mapStateToProps = ({ baseState }) => ({
    ...baseState
});

export default connect(mapStateToProps, {})(ThankYouPage)
