import { API_KEY, TOKEN } from '@_config/env.config';
import { expect, test } from '@playwright/test';

test('Authorization verification', async ({ request }) => {
  // Arrange:
  const expectedStatusCode = 200;
  // Act:
  const response = await request.get(
    `/1/members/me/boards?key=${API_KEY}&token=${TOKEN}`,
  );
  // Assert:
  expect(response.status()).toEqual(expectedStatusCode);
});
