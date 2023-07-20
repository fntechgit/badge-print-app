export const ExtraQuestionsKeys = {
    UsernameOnBadge: 'Username On Badge',
    Username: 'Roblox Username',
    UserId: 'Roblox User ID',
    FirstName: 'First Name',
    LastName: 'Last Name',
    Pronouns: 'Pronouns',
    Over21: '21 yrs'
}

export const PronounsQuestionAnswers = {
    NotListedAbove: 'Not listed above',
    DontDisclose: 'Prefer not to disclose or display on badge',
}

export const BadgeTypes = {
    'Staff': 'Event Staff - In-Person',
    'Volunteer': 'Volunteer Staff - In-Person',
    'Attendee': 'Invited Attendee - In-Person',
    'Speaker': 'Internal Speaker - In-Person',
    'ExternalSpeaker': 'External Speaker - In-Person',
    'Press': 'Press - In-Person',
    'Guest': 'RDC Guest: COMP In-Person',
};

export const BadgeTypesDisplayName = {
    [BadgeTypes.Staff]: 'Staff',
    [BadgeTypes.Volunteer]: 'Staff',
    [BadgeTypes.Attendee]: 'Attendee',
    [BadgeTypes.Speaker]: 'Speaker',
    [BadgeTypes.ExternalSpeaker]: 'Speaker',
    [BadgeTypes.Press]: 'Media',
    [BadgeTypes.Guest]: 'Attendee',
};

export const ZebraCardBadgeTypesColor = {
    // elected to match Pantone Black 6 C - Page C 189
    [BadgeTypes.Staff]: '#100420',
    // elected to match Pantone 2995 C - Page C 107
    [BadgeTypes.Volunteer]: '#00A9E0',
    [BadgeTypes.Attendee]: '#FFFFFF',
    // elected to match Pantone 2995 C - Page C 107
    [BadgeTypes.Speaker]: '#00A9E0',
    // elected to match Pantone 2725 C - Page C 82
    [BadgeTypes.ExternalSpeaker]: '#685BC7',
    // elected to match Pantone 7488 C - Page C 143
    [BadgeTypes.Press]: '#78D64B',
    // elected to match Pantone 2725 C - Page C 82
    [BadgeTypes.Guest]: '#685BC7',
};

export const WristbandBadgeTypesColor = {
    // elected to match Pantone Black 6 C - Page C 189
    [BadgeTypes.Staff]: '#100420',
    // elected to match Pantone 2985 C
    [BadgeTypes.Volunteer]: '#54C0E8',
    [BadgeTypes.Attendee]: '#FFFFFF',
    // elected to match Pantone 2985 C
    [BadgeTypes.Speaker]: '#54C0E8',
    // elected to match Pantone 272 C
    [BadgeTypes.ExternalSpeaker]: '#7473C0',
    // elected to match Pantone 7487 C
    [BadgeTypes.Press]: '#89DC65',
    // elected to match Pantone 272 C
    [BadgeTypes.Guest]: '#7473C0',
};
