import React from 'react';
import { doLoginBasicLogin} from 'openstack-uicore-foundation/lib/security/methods';
import T from "i18n-react/dist/i18n-react";

const LoginPage = () => {

    const onClickLogin = () => {
        doLoginBasicLogin('/check-in');
    };

    return (
      <main id="page-wrap">
          <div className="container">
              <div className="login-page">
                  <div className="login-message">{T.translate("general.login_message")}</div>
                  <button className="btn btn-primary btn-lg" onClick={onClickLogin}>
                      Log In
                  </button>
              </div>
          </div>
      </main>
    );
};

export default LoginPage;
