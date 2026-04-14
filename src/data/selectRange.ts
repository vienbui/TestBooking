export const PERIOD_LESS_THAN_1_YEAR_SELECT_RANGE = [
    { departing: 'July', returning: 'December' },
    { departing: 'December', returning: 'July (next year)' },
    { departing: 'July (next year)', returning: 'December (next year)' },
    { departing: 'December (next year)', returning: 'July (two years from now)' },
    { departing: 'July (two years from now)', returning: 'December (two years from now)' },
];

export const PERIOD_1_YEAR_SELECT_RANGE = [
    { departing: 'July', returning: 'July (next year)' },
    { departing: 'December', returning: 'December (next year)' },
    { departing: 'July (next year)', returning: 'July (two years from now)' },
    { departing: 'December (next year)', returning: 'December (two years from now)' },
];

export const PERIOD_1_5_YEAR_SELECT_RANGE = [
    { departing: 'July', returning: 'December (next year)' },
    { departing: 'December', returning: 'July (two years from now)' },
    { departing: 'July (next year)', returning: 'December (two years from now)' },
];

export const PERIOD_2_YEAR_SELECT_RANGE = [
    { departing: 'July', returning: 'July (two years from now)' },
    { departing: 'December', returning: 'December (two years from now)' },
];

export const PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE = [{ departing: 'July', returning: 'December (two years from now)' }];
