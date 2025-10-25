import { generatePathURLSimplified } from '@_src/API/helpers/path_params_generators/path_params_simplified_generator/simplified_path_parameters_generator';
import { headers, params } from '@_src/API/utils/api_utils';
import { pathParameters } from '@_src/API/utils/path_parameters_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Simplify the URLS generation

test('Authorization verification - path_parameters', async ({ request }) => {
  // Arrange:
  const expectedStatusCode = 200;
  const authVerificationUrl = generatePathURLSimplified(
    pathParameters.memberParameter,
    'me',
    'boards',
  );

  // Act: 'https://api.trello.com/1/members/me/boards?key={yourKey}&token={yourToken}'
  // const response = await request.get(`/1/members/me/boards`, {
  //   headers,
  //   params,
  // });
  const response = await request.get(authVerificationUrl, {
    headers,
    params,
  });

  // Assert:
  expect(response.status()).toEqual(expectedStatusCode);
});
