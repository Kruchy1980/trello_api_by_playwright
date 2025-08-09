import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Prepare models for data generation
// TODO: Prepare factories for models handling
// TODO: Simplify the URLS generation

test('Authorization verification', async ({ request }) => {
  // Arrange:
  const expectedStatusCode = 200;

  // Act: 'https://api.trello.com/1/members/me/boards?key={yourKey}&token={yourToken}'
  const response = await request.get(`/1/members/me/boards`, {
    headers,
    params,
  });

  // Assert:
  expect(response.status()).toEqual(expectedStatusCode);
});
