import { API_KEY, TOKEN } from '@_config/env.config';
import { expect, test } from '@playwright/test';

// test.describe.configure({ mode: 'serial' });

test.describe.serial('Boards handling - dependent tests', () => {
  let createdBoardId: string;
  test('1. Should create a board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedBoardName = 'My first Board name';
    const expectedBoardDescription = 'My first Board description';
    //Optional headers
    const headers = { 'Content-Type': 'application/json' };
    // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/boards/?name=${expectedBoardName}&desc=${expectedBoardDescription}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
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
  test('2. Should get a board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedBoardName = 'My first Board name';
    const expectedBoardDescription = 'My first Board description';
    //Optional headers
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

    const actualBoardId = responseJSON.id;
    expect(actualBoardId).toContain(createdBoardId);
    const actualBoardName = responseJSON.name;
    expect(actualBoardName).toContain(expectedBoardName);
    const actualBoardDescription = responseJSON.desc;
    expect(actualBoardDescription).toContain(expectedBoardDescription);
  });
  test('3. Should update a board', async ({ request }) => {
    // Arrange:
    const expectedBoardId = createdBoardId;
    const expectedStatusCode = 200;
    const updatedBoardName = 'Updated Board name';
    const updatedBoardDescription = 'Updated Board description';
    //Optional headers
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
  test('4. Should get a field from board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const updatedBoardName = 'Updated Board name';
    //Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}/{field}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${createdBoardId}/name?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);

    const actualBoardName = responseJSON._value;
    expect(actualBoardName).toContain(updatedBoardName);
  });
  test('5. Should Delete a board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedResponseValue = null;

    //Optional headers
    const headers = { Content_Type: 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.delete(
      `/1/boards/${createdBoardId}/?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);

    const actualResponseValue = responseJSON._value;
    expect(actualResponseValue).toEqual(expectedResponseValue);
  });
  test('6. (NP) Should NOT get a deleted board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 404;
    const expectedStatusText = 'Not Found';

    //Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${createdBoardId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    // console.log(response);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(response.statusText()).toContain(expectedStatusText);
  });
  test('7. (NP) Should Not get board when unauthorized user', async ({
    request,
  }) => {
    // Arrange:
    const expectedStatusCode = 401;
    const expectedStatusText = 'Unauthorized';

    //Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${createdBoardId}?key=poisfbnzpoib&token=${TOKEN}`,
      { headers },
    );
    // console.log(response);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(response.statusText()).toContain(expectedStatusText);
  });
});
