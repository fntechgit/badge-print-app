import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import printableBadge from '../components/printable-badge';

const DefaultBadgeViewType = 'Card';

class Badge {

    constructor(badge) {
        this._badge  = badge;
    }

    importTemplate = (templatePaths, { atIndex = -1 } = {}) => {
        const index = atIndex + 1;
        const templatePath = templatePaths[index];
        if (!templatePath)
            return ({ default: () =>
                <>
                    <p>Template not found.</p>
                    <p>Looking for template at following paths:</p>
                    <ul>
                        { templatePaths.map((path) => <li>{path}</li>) }
                    </ul>
                    <p>Badge type or view type name casing must match template path and name casing.</p>
                </>
            });
        return import(`../badge_templates/${templatePath}`)
            .catch(() => this.importTemplate(templatePaths, { atIndex: index }));
    }

    renderTemplate(summitSlug, viewTypeName = DefaultBadgeViewType, marketingSettings = []) {
        const { type } = this._badge;

        const badgeTemplatePaths = [
            `${summitSlug}/${type.name}/${viewTypeName}.js`,
            `${summitSlug}/${viewTypeName}.js`,
            `default/${viewTypeName}.js`
        ];

        const BadgeTemplate = React.lazy(
            () => this.importTemplate(badgeTemplatePaths)
        );

        const PrintableBadge = printableBadge(BadgeTemplate);

        return (
            <React.Suspense fallback={<div></div>}>
                <PrintableBadge badge={this} marketingSettings={marketingSettings} />
            </React.Suspense>
        );
    }

    getBadgeTypeName() {    
        const { type } = this._badge;
        return type.name;
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

    getQRCode(settings, level='L') {
        const {qr_code} = this._badge;
        let qr = null;

        if (qr_code) {
            qr = <QRCodeSVG value={qr_code} level={level} {...settings}/>
        }

        return qr;
    }

    getCustomQRCode(customValue, settings, level='L') {
        return <QRCodeSVG value={customValue} level={level} {...settings}/>
    }

    getAccessLevel(accessLevelName) {
        const {access_levels} = this._badge.type;
        let access_level = null;

        if (access_levels) {
            access_level =  access_levels.find(al => al.name == accessLevelName);
        }

        return access_level;
    }

    getAllFeatures() {
        const { features } = this._badge;
        return features;
    }

    getFeature(featureName) {
        const {features} = this._badge;
        let feature = null;

        if (features) {
            feature =  features.find(f => f.name == featureName);
        }

        return feature;
    }

    getFeatureCircles() {
        const { features } = this._badge;
        const circleFeatures = [];

        features.map(f => {
            if(f.name === "Media" || f.name === "Expo Sponsor Staff" || f.name === "Speaker" || f.name === "Keynote") {
                circleFeatures.push(f);
            }
        });

        return circleFeatures;
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

    getPronouns() {
        const validPronouns = ["she/her", "he/him", "they/them"];
        const { owner: { extra_questions } } = this._badge.ticket;
        const pronounItem = extra_questions?.find(eq => eq.question?.name === "Pronouns");
        const selectedChoice = pronounItem?.value; 
        let pronoun = '';

        pronounItem?.question?.values?.map(v => {
            const val = v.value.toLowerCase()
            if(validPronouns?.includes(val)) {
                if(v.id?.toString() === selectedChoice) {
                    pronoun = v?.value;
                }
            }
        })
        return pronoun;
    }
}

export default Badge;
