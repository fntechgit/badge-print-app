import React from 'react'


export function printableBadge(BadgeComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
        }

        onPrint(badge) {
            console.log('printed');
        }

        render() {
            return <BadgeComponent {...this.props}  onPrint={this.onPrint} />
        }
    }
}
