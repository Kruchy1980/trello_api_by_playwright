import { MemberRequest } from '@_src/API/requests/for_ROP_Requests/memberRequest';
import { headers, params } from '@_src/API/utils/api_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Improve to ROP (Request Object Pattern)

test('Authorization verification - RU_SO implemented', async ({ request }) => {
  // Arrange:
  const memberRequest = new MemberRequest(request);
  const expectedStatusCode = 200;
  // RUSO usage
  // const authVerificationUrl = memberRequest.buildUrl('me', 'boards');

  // Act: 'https://api.trello.com/1/members/me/boards?key={yourKey}&token={yourToken}'
  // // RUSO usage
  // const response = await memberRequest.sendRequest('get', authVerificationUrl, {
  //   headers,
  //   params,
  // });
  // RUSO usage
  const response = await memberRequest.verifyCredentials(
    'me',
    'boards',
    params,
    headers,
  );

  // Assert:
  expect(response.status()).toEqual(expectedStatusCode);
});
