
import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Router } from 'react-router-dom'
import { AjaxLoader, Dropdown } from "openstack-uicore-foundation/lib/components";
import history from './history'
import PrintPage from "./pages/print-page";
import NoMatchPage from "./pages/no-match-page"
import PrintProvider, { NoPrint } from 'react-easy-print';
import {clearBadge, changeSize} from "./actions/base-actions";


// move all env var to global scope so ui core has access to this
window.API_BASE_URL        = process.env['API_BASE_URL'];

class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleSizeChange = this.handleSizeChange.bind(this);
    }

    componentDidMount() {
        this.props.clearBadge();
    }

    handleSizeChange(ev) {
        this.props.changeSize(ev.target.value);
    }

    render() {
        let { loading, badge, sizes, size } = this.props;

        return (
            <PrintProvider>
                <NoPrint>
                    <Router history={history}>
                        <div>
                            <AjaxLoader show={ loading } size={ 120 }/>
                            <div className="header">
                                <div className="header-title row">
                                    <div className="col-md-4 title">
                                        Badge Printing App
                                    </div>
                                    <div className="col-md-4 title text-center">
                                        <button
                                            className="btn btn-default btn-lg"
                                            disabled={!badge}
                                            onClick={() => window.print()}
                                        >
                                            PRINT
                                        </button>
                                    </div>
                                    <div className="col-md-4 title text-right">
                                        <div className="size-select">
                                            <Dropdown
                                                value={size}
                                                onChange={this.handleSizeChange}
                                                placeholder="Select a Size"
                                                options={sizes}
                                            />
                                            <div className="size-label">Size</div>
                                        </div>
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
    ...baseState
});

export default connect(mapStateToProps, {
    clearBadge,
    changeSize
})(App)
