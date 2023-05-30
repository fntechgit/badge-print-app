import React, {useEffect, useState} from 'react';
import history from '../history'
import { Dropdown } from 'openstack-uicore-foundation/lib/components'
import { connect } from "react-redux";
import { loadSummits, setSummit } from "../actions/base-actions";
import T from "i18n-react/dist/i18n-react";

const SelectSummitPage = ({ summit, isLoggedUser, accessTokenQS, allSummits, loadSummits, setSummit }) => {
    const [showAllSummits, setShowAllSummits] = useState(false);
    const nowUtc = parseInt(new Date() / 1000);
    const filteredSummits = showAllSummits ? allSummits : allSummits.filter(s => s.end_date > nowUtc)
    const summits_ddl = filteredSummits.map(s => ({ label: s.name, value: s.id }));
    const value = summit ? summit.id : null;
    
    useEffect(() => {
        if ((isLoggedUser || accessTokenQS) && allSummits.length === 0) {
            loadSummits();
        }
    }, []);

    const onSelectSummit = (ev) => {
        const summitId = ev.target.value;
        const summit = allSummits.find(s => s.id === summitId);

        setSummit(summit);
        history.push(`check-in/${summit.slug}`);
    };
    
    return (
      <div className="container summit-select-page">
          <div className="row">
              <div className="col-md-12">
                  <p>{T.translate("general.select_label")}:</p>
                  <Dropdown
                    id="summit"
                    value={value}
                    placeholder={T.translate("general.select_show")}
                    options={summits_ddl}
                    onChange={onSelectSummit}
                  />
              </div>
              <div className="col-md-12 form-check abc-checkbox">
                  <input
                    type="checkbox"
                    id="all_summits"
                    checked={showAllSummits}
                    onChange={ev => setShowAllSummits(ev.target.checked)}
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor="all_summits">
                      {T.translate("general.show_all_summits")}
                  </label>
              </div>
          </div>
      </div>
    );
}


const mapStateToProps = ({ baseState, loggedUserState }) => ({
    isLoggedUser: loggedUserState.isLoggedUser,
    ...baseState
});

export default connect(mapStateToProps, {
    loadSummits,
    setSummit,
})(SelectSummitPage)
