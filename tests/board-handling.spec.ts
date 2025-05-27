import { API_KEY, TOKEN } from '@_config/env.config';
import { expect, test } from '@playwright/test';

test.describe('Boards handling - dependent tests', () => {
  let createdBoardId: string;
  test('1. Should Create a board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedBoardName = 'My first board name';
    const expectedBoardDescription = 'My first board description';
    // Act:
    const response = await request.post(
      `/1/boards/?name=${expectedBoardName}&desc=${expectedBoardDescription}&key=${API_KEY}&token=${TOKEN}`,
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdBoardId = responseJSON.id;
    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    const actualBoardName = responseJSON.name;
    expect(actualBoardName).toContain(expectedBoardName);
    const actualBoardDescription = responseJSON.desc;
    expect(actualBoardDescription).toContain(expectedBoardDescription);
  });
  test('2. Should Get a board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedBoardName = 'My first board name';
    const expectedBoardDescription = 'My first board description';
    const expectedBoardId = createdBoardId;
    // Opcjonalny header
    const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${expectedBoardId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualBoardId = responseJSON.id;
    expect(actualBoardId).toContain(expectedBoardId);
    const actualBoardName = responseJSON.name;
    expect(actualBoardName).toContain(expectedBoardName);
    const actualBoardDescription = responseJSON.desc;
    expect(actualBoardDescription).toContain(expectedBoardDescription);
  });
  test('3. Should Update a board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const updatedBoardName = 'My first board name - updated';
    const updatedBoardDescription = 'My first board description - updated';
    const expectedBoardId = createdBoardId;
    // Opcjonalny header
    const headers = { 'Content-Type': 'application/json' };
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/boards/${expectedBoardId}?name=${updatedBoardName}&desc=${updatedBoardDescription}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualBoardId = responseJSON.id;
    expect(actualBoardId).toContain(expectedBoardId);
    const actualBoardName = responseJSON.name;
    expect(actualBoardName).toContain(updatedBoardName);
    const actualBoardDescription = responseJSON.desc;
    expect(actualBoardDescription).toContain(updatedBoardDescription);
  });
  test('4. Should Get a field on a Board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const updatedBoardName = 'My first board name - updated';
    const expectedBoardId = createdBoardId;
    // Opcjonalny header
    const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/boards/{id}/{field}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${expectedBoardId}/name?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualBoardName = responseJSON._value;
    expect(actualBoardName).toContain(updatedBoardName);
  });
  test('5. Should Delete a Board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedBoardId = createdBoardId;
    const expectedResponseValue = null;
    // Opcjonalny header
    const headers = { 'Content-Type': 'application/json' };
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.delete(
      `/1/boards/${expectedBoardId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualResponseValue = responseJSON._value;
    expect(actualResponseValue).toEqual(expectedResponseValue);
  });
  test('6. NP Should Get deleted board', async ({ request }) => {
    // Arrange:
    const expectedBoardId = createdBoardId;
    const expectedStatusCode = 404;
    const expectedStatusText = 'Not Found';
    // Opcjonalny header
    const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${expectedBoardId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(response.statusText()).toEqual(expectedStatusText);
  });
  test('7. NP Should not get Board when unauthorized user', async ({
    request,
  }) => {
    // Arrange:
    const expectedBoardId = createdBoardId;
    const expectedStatusCode = 401;
    const expectedStatusText = 'Unauthorized';
    // Opcjonalny header
    const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${expectedBoardId}?key=${API_KEY}&token=098q2rqt98gqa`,
      { headers },
    );

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(response.statusText()).toEqual(expectedStatusText);
  });
});
