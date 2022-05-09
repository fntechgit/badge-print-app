import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import printableBadge from '../components/printable-badge';


class Badge {

    constructor(badge) {
        this._badge  = badge;
    }

    renderTemplate(summitSlug) {
        const {type} = this._badge;

        const BadgeTemplate = React.lazy(
            () =>
                import(`../badge_templates/${summitSlug}/${type.name}/badge_1.js`)
                    .catch(() => import(`../badge_templates/default/badge_1.js`))
        );

        const PrintableBadge = printableBadge(BadgeTemplate);

        return (
            <React.Suspense fallback={<div></div>}>
                <PrintableBadge badge={this} />
            </React.Suspense>
        );
    }

    getFirstName() {
        const {owner} = this._badge.ticket;
        let firstName = 'N/A';

        if (owner) {
            if (owner.first_name) {
                firstName = owner.first_name;
            } else if (owner.member) {
                firstName = owner.member.first_name;
            }
        }

        return firstName;
    }

    getLastName() {
        const {owner} = this._badge.ticket;
        let lastName = 'N/A';

        if (owner) {
            if (owner.last_name) {
                lastName = owner.last_name;
            } else if (owner.member) {
                lastName = owner.member.last_name;
            }
        }

        return lastName;
    }

    getFullName() {
        const {owner} = this._badge.ticket;
        let fullName = 'N/A';

        if (owner) {
            if (owner.first_name && owner.last_name) {
                fullName = `${owner.first_name} ${owner.last_name}`;
            } else if (owner.member) {
                fullName = `${owner.member.first_name} ${owner.member.last_name}`;
            }
        }

        return fullName;
    }

    getIRC() {
        const {owner} = this._badge.ticket;
        let irc = 'N/A';

        if (owner.member && owner.member.irc) {
            irc = owner.member.irc;
        }

        return irc;
    }

    getCompany() {
        const {owner} = this._badge.ticket;
        let company = 'N/A';

        if (owner.company) {
            company = owner.company;
        }

        return company;
    }

    getTwitter() {
        const {owner} = this._badge.ticket;
        let twitter = 'N/A';

        if (owner.member && owner.member.twitter) {
            twitter = owner.member.twitter;
        }

        return twitter;
    }

    hasQRCode() {
        return this._badge.qr_code;
    }

    getQRCode(settings) {
        const {qr_code} = this._badge;
        let qr = null;

        if (qr_code) {
            qr = <QRCodeSVG value={qr_code} {...settings} />
        }

        return qr;
    }

    getAccessLevel(accessLevelName) {
        const {access_levels} = this._badge.type;
        let access_level = null;

        if (access_levels) {
            access_level =  access_levels.find(al => al.name == accessLevelName);
        }

        return access_level;
    }

    getFeature(featureName) {
        const {features} = this._badge;
        let feature = null;

        if (features) {
            feature =  features.find(f => f.name == featureName);
        }

        return feature;
    }

    getExtraQuestionValue(extraQuestionName) {
        const { owner: { extra_questions } } = this._badge.ticket;
        let extraQuestionValue = null;

        if (extra_questions) {
            const extraQuestion = extra_questions.find(eq => eq.question.name == extraQuestionName);
            if (extraQuestion) {
                if (extraQuestion.question && extraQuestion.question.values) {
                    const extraQuestionAnswer = extraQuestion.question.values.find(v => v.id == extraQuestion.value)
                    if (extraQuestionAnswer) extraQuestionValue = extraQuestionAnswer.value;
                } else {
                    extraQuestionValue = extraQuestion.value;
                }
            }
        }

        return extraQuestionValue;
    }
}

export default Badge;
