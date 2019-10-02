
import React from 'react'
import { connect } from 'react-redux'
import { AjaxLoader } from "openstack-uicore-foundation/lib/components";
import PrintPage from "./pages/print-page";
import NoMatchPage from "./pages/no-match-page"
import { getBadge } from "./actions/base-actions"


// move all env var to global scope so ui core has access to this
window.API_BASE_URL        = process.env['API_BASE_URL'];


class App extends React.PureComponent {

    componentWillMount() {
        this.props.getBadge();
    }


    render() {
        let { loading, badge} = this.props;


        return (
            <div>
                <AjaxLoader show={ loading } size={ 120 }/>
                <div className="header">
                    <div className="header-title row">
                        <div className="col-md-12 title">
                            Print Badge
                        </div>
                    </div>
                </div>


                {!badge &&
                <NoMatchPage />
                }

                {badge &&
                <PrintPage badge={badge}/>
                }

            </div>
        );
    }
}

const mapStateToProps = ({ baseState }) => ({
    badge: baseState.badge,
    loading : baseState.loading,
})

export default connect(mapStateToProps, {
    getBadge,
})(App)
