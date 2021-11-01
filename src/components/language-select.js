/**
 * Copyright 2018 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import React from 'react'
import ReactFlagsSelect from 'react-flags-select';


export default class LanguageSelect extends React.Component {

    constructor(props) {
        super(props);

    }

    handleChange(countryCode) {
        let lang = 'en';
        switch(countryCode) {
            case 'US':
                lang = 'en';
                break;
            case 'ES':
                lang = 'es';
                break;
        }

        localStorage.setItem('PREFERRED_LANGUAGE', lang);
        location.reload();
    }

    render() {
        const {language} = this.props;
        let defaultLang = 'US';

        switch(language) {
            case 'en':
                defaultLang = 'US';
                break;
            case 'es':
                defaultLang = 'ES';
                break;

        }

        return (
            <div className="language-select">
                <ReactFlagsSelect
                    selected={defaultLang}
                    countries={["US", "ES"]}
                    onSelect={this.handleChange}
                    showOptionLabel={false}
                    showSelectedLabel={false}
                />
            </div>
        );
    }
}
