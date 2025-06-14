import { API_KEY, TOKEN } from '@_config/env.config';
import { expect, test } from '@playwright/test';

test.describe.serial('Lists handling - dependent tests', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  test('0. Board preparation', async ({ request }) => {
    // Arrange:
    const expectedBoardName = `My Board - ${new Date().toISOString().split('T')[1].split('Z')[0]}`;

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };
    // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/boards/?name=${expectedBoardName}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdBoardId = responseJSON.id;
  });
  test('1. Should create a new list', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedListName = 'My first list name';
    const position = 'top';

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };
    // Act: 'https://api.trello.com/1/lists?name={name}&idBoard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/lists?name=${expectedListName}&pos=${position}&idBoard=${createdBoardId}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualListName = responseJSON.name;
    expect(actualListName).toContain(expectedListName);
  });
  test('2. Should get all lists from Board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedListsQuantity = 0;

    //Optional headers
    const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${createdBoardId}/lists?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    responseJSON.forEach((listId: { id: string }) => {
      createdListsIds.push(listId.id);
    });
    // console.log(createdListsIds);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualListQuantity = responseJSON.length;
    expect(actualListQuantity).toBeGreaterThan(expectedListsQuantity);
  });
  test('3. Should update list field', async ({ request }) => {
    // Arrange:
    const listForUpdateId = createdListsIds[1];
    const expectedStatusCode = 200;
    const updatedListName = 'Updated by user';

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };
    // Act: ('https://api.trello.com/1/lists/{id}/{field}?key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/lists/${listForUpdateId}?name=${updatedListName}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualListId = responseJSON.id;
    expect(actualListId).toContain(listForUpdateId);
    const actualListName = responseJSON.name;
    expect(actualListName).toContain(updatedListName);
  });
  test('4. Should get a list field', async ({ request }) => {
    // Arrange:
    const listId = createdListsIds[1];
    const expectedStatusCode = 200;
    const expectedListName = 'Updated by user';

    //Optional headers
    const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/lists/${listId}?fields=name&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);

    const actualListName = responseJSON.name;
    expect(actualListName).toContain(expectedListName);
  });
  test('5. Should Archive a list', async ({ request }) => {
    // Arrange:
    const listForArchiveId = createdListsIds[2];
    const expectedStatusCode = 200;
    const expectedListStatus = true;

    // Opcjonalny header
    const headers = { 'Content-Type': 'application/json' };
    // Act: 'https://api.trello.com/1/lists/{id}/closed?key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/lists/${listForArchiveId}?closed=${expectedListStatus}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualListId = responseJSON.id;
    expect(actualListId).toEqual(listForArchiveId);
    const actualListStatus = responseJSON.closed;
    expect(actualListStatus).toEqual(expectedListStatus);
  });
  test('6. Should get archived list', async ({ request }) => {
    // Arrange:
    const listForArchiveId = createdListsIds[2];
    const expectedStatusCode = 200;
    const expectedListStatus = true;
    const expectedListName = 'Doing';

    // Opcjonalny header
    const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/lists/${listForArchiveId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualListId = responseJSON.id;
    expect(actualListId).toEqual(listForArchiveId);
    const actualListStatus = responseJSON.closed;
    expect(actualListStatus).toEqual(expectedListStatus);
    const actualListName = responseJSON.name;
    expect(actualListName).toEqual(expectedListName);
  });
  test('7. Should update a list fields', async ({ request }) => {
    // Arrange:
    const listForUpdateId = createdListsIds[createdListsIds.length - 1];
    const expectedStatusCode = 200;
    const updatedListName = 'Tasks with the highest priority';
    const position = 'top';
    // Opcjonalny header
    const headers = { 'Content-Type': 'application/json' };
    // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/lists/${listForUpdateId}?name=${updatedListName}&pos=${position}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualListId = responseJSON.id;
    expect(actualListId).toEqual(listForUpdateId);
    const actualListName = responseJSON.name;
    expect(actualListName).toEqual(updatedListName);
  });
  test('Delete a board', async ({ request }) => {
    // Arrange:
    //Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(
      `/1/boards/${createdBoardId}/?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
  });
});
