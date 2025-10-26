import { MemberRequest } from '@_src/API/requests/memberRequest';
import { headers, params } from '@_src/API/utils/api_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Implement RUSO (Request Unit/Utility/ Service Object)
// TODO: Improve to ROP (Request Object Model)

test('Authorization verification - RU_SO implemented', async ({ request }) => {
  // Arrange:
  const memberRequest = new MemberRequest(request);
  const expectedStatusCode = 200;
  // // Only path generator usage
  // const authVerificationUrl = generatePathURLSimplified(
  //   pathParameters.memberParameter,
  //   'me',
  //   'boards',
  // );
  // RUSO usage
  const authVerificationUrl = memberRequest.buildUrl('me', 'boards');

  // Act: 'https://api.trello.com/1/members/me/boards?key={yourKey}&token={yourToken}'
  // Path generator usage only
  // const response = await request.get(authVerificationUrl, {
  //   headers,
  //   params,
  // });
  // RUSO usage
  const response = await memberRequest.sendRequest('get', authVerificationUrl, {
    headers,
    params,
  });

  // Assert:
  expect(response.status()).toEqual(expectedStatusCode);
});
