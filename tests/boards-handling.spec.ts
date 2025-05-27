import { API_KEY, TOKEN } from '@_config/env.config';
import { expect, test } from '@playwright/test';

test.describe('Boards handling - dependent tests', () => {
  let createdBoardId: string;
  test('1. Should Create a board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedBoardName = 'My first Board';
    const expectedBoardDescription = 'My first board description';
    // Optional headers
    const headers = { 'Content-Type': 'application/json' };
    // Act:
    const response = await request.post(
      `/1/boards/?name=${expectedBoardName}&desc=${expectedBoardDescription}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    createdBoardId = responseJSON.id;
    // console.log(responseJSON);
    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    const actualBoardName = responseJSON.name;
    expect(actualBoardName).toContain(expectedBoardName);
    const actualBoardDescription = responseJSON.desc;
    expect(actualBoardDescription).toContain(expectedBoardDescription);
  });
  test('2. Should Get a board Data', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedBoardName = 'My first Board';
    const expectedBoardDescription = 'My first board description';
    const expectedBoardId = createdBoardId;
    const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${createdBoardId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    // expect(responseJSON).toHaveProperty('id');
    const actualBoardId = responseJSON.id;
    expect(actualBoardId).toContain(expectedBoardId);
    const actualBoardName = responseJSON.name;
    expect(actualBoardName).toContain(expectedBoardName);
    const actualBoardDescription = responseJSON.desc;
    expect(actualBoardDescription).toContain(expectedBoardDescription);
  });
});
