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
    [BadgeTypes.Staff]: '#010101',
    // elected to match Pantone 2995 C - AKA Blue Speaker
    [BadgeTypes.Volunteer]: '#00A7E1',
    [BadgeTypes.Attendee]: '#FFFFFF',
    // elected to match Pantone 2995 C- AKA Blue Speaker
    [BadgeTypes.Speaker]: '#00A7E1',
    // elected to match Pantone 2725 C - AKA Purple Speaker
    [BadgeTypes.ExternalSpeaker]: '#685BC7',
    // elected to match Pantone 7487 C - AKA Green Media
    [BadgeTypes.Press]: '#89DC65',
    // elected to match Pantone 2725 C - AKA Purple Speaker
    [BadgeTypes.Guest]: '#685BC7',
};

export const WristbandBadgeTypesColor = {
    // elected to match Pantone Black 6 C - Page C 189
    [BadgeTypes.Staff]: '#111111',
    // elected to match Pantone 637 C - AKA Blue Speaker
    [BadgeTypes.Volunteer]: '#00C1DE',
    [BadgeTypes.Attendee]: '#FFFFFF',
    // elected to match Pantone 637 C - AKA Blue Speaker
    [BadgeTypes.Speaker]: '#00C1DE',
    // elected to match Pantone 2735 C - AKA Purple Speaker
    [BadgeTypes.ExternalSpeaker]: '#270089',
    // elected to match Pantone 367 C - AKA Green Media
    [BadgeTypes.Press]: '#65BD60',
    // elected to match Pantone 2735 C - AKA Purple Speaker
    [BadgeTypes.Guest]: '#270089',
};
