import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Make tests independent
// TODO: Prepare models for data generation
// TODO: Prepare factories for models handling
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe.serial('Lists handling - dependent tests', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  // const headers: { [key: string]: string } = {
  //   'Content-Type': 'application/json',
  //   Accept: 'application/json',
  // };
  // const params: { [key: string]: string } = { key: API_KEY, token: TOKEN };
  test('0. Board preparation', async ({ request }) => {
    // Arrange:
    const expectedBoardName = `My Board - ${new Date().toISOString().split('T')[1].split('Z')[0]}`;

    //Optional headers
    // const headers = { 'Content-Type': 'application/json' };
    // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/boards/?name=${expectedBoardName}`,
      { headers, params },
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
    // const headers = { 'Content-Type': 'application/json' };
    // Act: 'https://api.trello.com/1/lists?name={name}&idBoard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/lists?name=${expectedListName}&pos=${position}&idBoard=${createdBoardId}`,
      { headers, params },
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
    // const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
    const response = await request.get(`/1/boards/${createdBoardId}/lists`, {
      headers,
      params,
    });
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
    // const headers = { 'Content-Type': 'application/json' };
    // Act: ('https://api.trello.com/1/lists/{id}/{field}?key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/lists/${listForUpdateId}?name=${updatedListName}`,
      { headers, params },
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
    const updatedListId = createdListsIds[1];
    const expectedStatusCode = 200;
    const updatedListName = 'Updated by user';

    //Optional headers
    // const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/lists/${updatedListId}?fields=name`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualListId = responseJSON.id;
    expect(actualListId).toContain(updatedListId);
    const actualListName = responseJSON.name;
    expect(actualListName).toContain(updatedListName);
  });
  test('5. Should Archive a list', async ({ request }) => {
    // Arrange:
    const listForArchiveId = createdListsIds[2];
    const expectedStatusCode = 200;
    const expectedListStatus = true;

    // Opcjonalny header
    // const headers = { 'Content-Type': 'application/json' };
    // Act: 'https://api.trello.com/1/lists/{id}/closed?key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/lists/${listForArchiveId}?closed=${expectedListStatus}`,
      { headers, params },
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
    // const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
    const response = await request.get(`/1/lists/${listForArchiveId}`, {
      headers,
      params,
    });
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
    // const headers = { 'Content-Type': 'application/json' };
    // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/lists/${listForUpdateId}?name=${updatedListName}&pos=${position}`,
      { headers, params },
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
    // const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
  });
});
