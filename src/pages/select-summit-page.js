import React from 'react';
import history from '../history'
import { Dropdown } from 'openstack-uicore-foundation/lib/components'
import {connect} from "react-redux";
import {loadSummits, setSummit} from "../actions/base-actions";
import T from "i18n-react/dist/i18n-react";

class SelectSummitPage extends React.Component {

    componentDidMount () {
        let { isLoggedUser, accessTokenQS } = this.props;
        if (isLoggedUser || accessTokenQS) {
            this.props.loadSummits();
        }
    }

    onSelectSummit = (ev) => {
        const {allSummits} = this.props;
        const summitId = ev.target.value;
        const summit = allSummits.find(s => s.id === summitId);

        this.props.setSummit(summit);
        history.push(`check-in/${summit.slug}`);
    };

    render(){
        let { summit, allSummits, loading } = this.props;
        let summits_ddl = allSummits.map(s => ({label: s.name, value: s.id}));
        let value = summit ? summit.id : null;

        return (
            <div className="container">
                <p>{T.translate("general.select_label")}:</p>
                <Dropdown
                    id="summit"
                    value={value}
                    placeholder={T.translate("general.select_show")}
                    options={summits_ddl}
                    onChange={this.onSelectSummit}
                />
            </div>
        );
    }
}


const mapStateToProps = ({ baseState, loggedUserState }) => ({
    isLoggedUser: loggedUserState.isLoggedUser,
    ...baseState
});

export default connect(mapStateToProps, {
    loadSummits,
    setSummit,
})(SelectSummitPage)
