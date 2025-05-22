import { API_KEY, TOKEN } from '@_config/env.config';
import { expect, test } from '@playwright/test';

test.describe('Boards handling - dependent tests', () => {
  test('1. Should Create a Board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedBoardName = 'My first Board name';
    const expectedBoardDescription = 'My first board description';

    // Optional headers
    const headers = { 'Content-Type': 'application/json' };
    // Act:
    const response = await request.post(
      `/1/boards/?name=${expectedBoardName}&desc=${expectedBoardDescription}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    const actualName = responseJSON.name;
    expect(actualName).toContain(expectedBoardName);
    const actualDescription = responseJSON.desc;
    expect(actualDescription).toContain(expectedBoardDescription);
  });
});
