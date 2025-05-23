import { API_KEY, TOKEN } from '@_config/env.config';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Boards handling - dependent test', () => {
  let createdBoardId: string;
  test('1. Should Create a Board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedBoardName = 'My first board name';
    const expectedBoardDescription = 'My first board description';
    //  Optional headers
    const headers = { 'Content-Type': 'application/json' };
    // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
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
  test('2. Should Get a Board Data', async ({ request }) => {
    // Arrange:
    const expectedBoardId = createdBoardId;
    const expectedStatusCode = 200;
    const expectedBoardName = 'My first board name';
    const expectedBoardDescription = 'My first board description';
    //  Optional headers
    const headers = { Accept: 'application/json' };

    // Act: https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
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
  test('3. Should Update a Board Data', async ({ request }) => {
    // Arrange:
    const expectedBoardId = createdBoardId;
    const expectedStatusCode = 200;
    const expectedBoardName = 'Updated board name';
    const expectedBoardDescription = 'Updated board description';
    //  Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/boards/${expectedBoardId}?name=${expectedBoardName}&desc=${expectedBoardDescription}&key=${API_KEY}&token=${TOKEN}`,
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
  test('4. Should get a Board field', async ({ request }) => {
    // Arrange:
    const expectedBoardId = createdBoardId;
    const expectedStatusCode = 200;
    const expectedBoardName = 'Updated board name';
    // const expectedBoardDescription = 'Updated board description';
    //  Optional headers
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
    expect(actualBoardName).toContain(expectedBoardName);
  });
  test('5. Should delete a board', async ({ request }) => {
    // Arrange:
    const expectedBoardId = createdBoardId;
    const expectedStatusCode = 200;
    const expectedResponseValue = null;
    // const expectedBoardName = 'Updated board name';
    // // const expectedBoardDescription = 'Updated board description';
    //  Optional headers
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
  test('6. NP Should NOT get deleted board', async ({ request }) => {
    // Arrange:
    const expectedBoardId = createdBoardId;
    const expectedStatusCode = 404;
    const expectedStatusText = 'Not Found';
    //  Optional headers
    const headers = { Accept: 'application/json' };

    // Act: https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${expectedBoardId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(response.statusText()).toEqual(expectedStatusText);
  });
});
