/*
TRELLO API Documentation: "https://developer.atlassian.com/cloud/trello/rest/api-group-actions/#api-group-actions"
*/

import { API_KEY, TOKEN } from '@_config/env.config';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Boards handling - dependent tests', () => {
  let createdBoardId: string;
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
    // Passing Board ID
    createdBoardId = responseJSON.id;
  });
  test('2. Should Get Created Board Data', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedBoardName = 'My first Board name';
    const expectedBoardDescription = 'My first board description';
    const expectedBoardId = createdBoardId;

    // Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${expectedBoardId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualBoardId = responseJSON.id;
    expect(actualBoardId).toContain(expectedBoardId);
    const actualBoardName = responseJSON.name;
    expect(actualBoardName).toContain(expectedBoardName);
    const actualBoardDescription = responseJSON.desc;
    expect(actualBoardDescription).toContain(expectedBoardDescription);
  });
  test('3. Should Update Created Board Data', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedBoardName = 'Updated Board Name';
    const expectedBoardDescription = 'Updated Board Description';
    const expectedBoardId = createdBoardId;

    // Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/boards/${expectedBoardId}?key=${API_KEY}&token=${TOKEN}&name=${expectedBoardName}&desc=${expectedBoardDescription}`,
      { headers },
    );
    const responseJSON = await response.json();

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualBoardId = responseJSON.id; // Opcjonalna aserja można sprawdzić czy przy updacie Boarda nie zmienia się jego ID
    expect(actualBoardId).toContain(expectedBoardId);
    const actualBoardName = responseJSON.name;
    expect(actualBoardName).toContain(expectedBoardName);
    const actualBoardDescription = responseJSON.desc;
    expect(actualBoardDescription).toContain(expectedBoardDescription);
  });
  test('4. Should GET Created Board name', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedBoardName = 'Updated Board Name';
    const expectedBoardId = createdBoardId;

    // Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}/{field}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${expectedBoardId}/name?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualBoardName = responseJSON._value;
    expect(actualBoardName).toContain(expectedBoardName);
  });
  test('5. Should Delete Created Board name', async ({ request }) => {
    // Arrange:
    const expectedBoardId = createdBoardId;
    const expectedStatusCode = 200;
    const expectedResponseValue = null;

    // Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.delete(
      `/1/boards/${expectedBoardId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    // Optionalna asercja
    const actualResponseValue = responseJSON._value;
    expect(actualResponseValue).toBe(expectedResponseValue);
  });
  test('6. NP Should NOT get Deleted Board Data - (Optional)', async ({
    request,
  }) => {
    // Arrange:
    const expectedBoardId = createdBoardId;
    const expectedStatusCode = 404;
    const expectedResponseText = 'Not Found';

    // Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${expectedBoardId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(response.statusText()).toEqual(expectedResponseText);
  });
});
