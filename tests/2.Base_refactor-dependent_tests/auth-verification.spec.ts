import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Remove duplicated headers from tests
// TODO: Separate auth keys from URL
// TODO: Prepare models for data generation
// TODO: Prepare factories for models handling
// TODO: Simplify the URLS generation

test('Authorization verification', async ({ request }) => {
  // Arrange:
  const expectedStatusCode = 200;
  // const headers: { [key: string]: string } = {
  //   'Content-Type': 'application/json',
  //   Accept: 'application/json',
  // };
  // const params: { [key: string]: string } = { key: API_KEY, token: TOKEN };

  // Act: curl 'https://api.trello.com/1/members/me/boards?key={yourKey}&token={yourToken}'
  const response = await request.get(`/1/members/me/boards`, {
    headers,
    params,
  });

  // Assert:
  expect(response.status()).toEqual(expectedStatusCode);
});
