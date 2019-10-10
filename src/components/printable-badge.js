import React from 'react'
import { Print } from 'react-easy-print';

export default function printableBadge(BadgeComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
        }

        onPrint(badge) {
            console.log('printed');
        }

        render() {
            return (
                <Print single name="badge">
                    <BadgeComponent {...this.props}  onPrint={this.onPrint} />
                </Print>
            );
        }
    }
}
