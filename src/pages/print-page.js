import React from 'react';
import {connect} from "react-redux";
import {getBadge} from "../actions/base-actions";
import Badge from '../model/badge';


class PrintPage extends React.Component {

    componentDidMount() {
        this.props.getBadge();
    }

    render(){
        console.log('Print PAge');

        let {badge} = this.props;
        if (!badge) return (<div></div>);


        let badgeObj = new Badge(badge);

        return (
            <div className="container print-page-wrapper">
                <h1 className="title"> BADGE </h1>

                {badgeObj.renderTemplate()}
            </div>
        );
    }
}


const mapStateToProps = ({ baseState }) => ({
    badge: baseState.badge,
})

export default connect(mapStateToProps, {
    getBadge,
})(PrintPage)
