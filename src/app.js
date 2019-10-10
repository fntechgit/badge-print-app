
import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Router } from 'react-router-dom'
import { AjaxLoader } from "openstack-uicore-foundation/lib/components";
import history from './history'
import PrintPage from "./pages/print-page";
import NoMatchPage from "./pages/no-match-page"
import PrintProvider, { Print, NoPrint } from 'react-easy-print';


// move all env var to global scope so ui core has access to this
window.API_BASE_URL        = process.env['API_BASE_URL'];

class App extends React.PureComponent {

    render() {
        let { loading } = this.props;

        return (
            <PrintProvider>
                <NoPrint>
                    <Router history={history}>
                        <div>
                            <AjaxLoader show={ loading } size={ 120 }/>
                            <div className="header">
                                <div className="header-title row">
                                    <div className="col-md-6 title">
                                        Print Badge
                                    </div>
                                    <div className="col-md-6 title">
                                        <button onClick={() => window.print()}>PRINT</button>
                                    </div>
                                </div>
                            </div>

                            <Switch>
                                <Route path="/summit/:summit_id/ticket/:ticket_id" component={PrintPage} />
                                <Route component={NoMatchPage} />
                            </Switch>

                        </div>
                    </Router>
                </NoPrint>
            </PrintProvider>
        );
    }
}

const mapStateToProps = ({ baseState }) => ({
    loading : baseState.loading,
})

export default connect(mapStateToProps, {})(App)
