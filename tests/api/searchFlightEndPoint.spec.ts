import { test, expect } from '@playwright/test';
import { CANDIDATE_PATH } from '../../src/data/env';

test('[API-001] Verify search flight endpoint is working', { tag: ['@api', '@smoke'] }, async ({ request }) => {
    const response = await request.post(CANDIDATE_PATH, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
            departing: '0',
            returning: '5',
            promotional_code: '',
        },
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.text();
    expect(responseBody).toContain('Seats available!');
});
