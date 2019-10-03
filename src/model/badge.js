import React from 'react'
import printableBadge from '../components/printable-badge'


class Badge {

    constructor(badge) {
        this._badge  = badge;
    }

    renderTemplate() {
        const {summit_id, badge_type} = this._badge;
        const template_path = `./badge_templates/summit_${summit_id}/${badge_type}/badge_1.js`;

        // TODO get all files in dir dynamically

        /*if (templates.length == 0) {
            return (<div>Template not found.</div>);
        } else {
            const BadgeTemplate = printableBadge(React.lazy(() => import(template_path)));
            return <BadgeTemplate badge={this._badge} />
        }*/

        const BadgeTemplate = React.lazy(() => import(`../badge_templates/summit_${summit_id}/${badge_type}/badge_1.js`));
        //const PrintableBadge = printableBadge(BadgeTemplate);
        return (
            <React.Suspense fallback={<div>Loading Badge</div>}>
                <BadgeTemplate badge={this._badge} />
            </React.Suspense>
        );
    }

}

export default Badge;
