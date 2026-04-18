export const VALID_PROMO_CODES = [
    { code: 'AF3-FJK-418', discount: 30 },
    { code: 'JT2-OPQ-114', discount: 20 },
    { code: 'MB4-OPQ-116', discount: 40 },
    { code: 'JJ7-OPQ-119', discount: 70 },
    { code: 'AT1-OPQ-102', discount: 10 },
    { code: 'JJ5-OPQ-320', discount: 50 },
];

export const INVALID_PROMO_CODES = [
    { code: 'AF3-FJK-419', reason: 'wrong check digit' },
    { code: 'JJ7OPQ119', reason: 'no dashes' },
    { code: 'AF3-FJ!-418', reason: 'special characters' },
];
