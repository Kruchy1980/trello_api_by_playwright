import { API_KEY, TOKEN } from '@_config/env.config';
import { expect, test } from '@playwright/test';

test.describe('Lists handling - dependent tests', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  test('0. Should Create a board', async ({ request }) => {
    // Arrange:
    const expectedBoardName = `Board name - ${
      new Date().toISOString().split('T')[1].split('Z')[0]
    }`;
    // Opcjonalny header
    const headers = { 'Content-Type': 'application/json' };

    // Act:
    const response = await request.post(
      `/1/boards/?name=${expectedBoardName}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdBoardId = responseJSON.id;
  });

  test('1. Should create a List', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedListName = 'My first list name';
    const position = 'top';
    // Opcjonalny header
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
    expect(responseJSON).toHaveProperty('id');
    const actuaLListName = responseJSON.name;
    expect(actuaLListName).toContain(expectedListName);
  });
  test('2. Should get all list from a Board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedMinListsQuantity = 0;
    // Opcjonalny header
    const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${createdBoardId}/lists?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log('Present Lists', responseJSON);

    responseJSON.forEach((el: { id: string }) => {
      createdListsIds.push(el.id);
    });
    // console.log(createdListsIds);
    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualListsQuantity = responseJSON.length;
    expect(actualListsQuantity).toBeGreaterThan(expectedMinListsQuantity);
  });
  test('3. Should Update list field', async ({ request }) => {
    // Arrange:
    const listForUpdateId = createdListsIds[1];
    const expectedStatusCode = 200;
    const updatedListName = 'Updated List name';

    // Opcjonalny header
    const headers = { 'Content-Type': 'application/json' };
    // Act: ('https://api.trello.com/1/lists/{id}/{field}?key=APIKey&token=APIToken'
    // !!! Be aware
    // const response = await request.put(
    //   `/1/lists/${listForUpdateId}/name?${updatedListName}&key=${API_KEY}&token=${TOKEN}`,
    //   { headers },
    // );
    const response = await request.put(
      `/1/lists/${listForUpdateId}?name=${updatedListName}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualListid = responseJSON.id;
    expect(actualListid).toEqual(listForUpdateId);
    const actualListName = responseJSON.name;
    expect(actualListName).toEqual(updatedListName);
  });
  test('4. Should Get a list', async ({ request }) => {
    // Arrange:
    const listForUpdateId = createdListsIds[1];
    const expectedStatusCode = 200;
    const updatedListName = 'Updated List name';

    // Opcjonalny header
    const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/lists/${listForUpdateId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualListId = responseJSON.id;
    expect(actualListId).toEqual(listForUpdateId);
    const actualListName = responseJSON.name;
    expect(actualListName).toEqual(updatedListName);
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
    // Act: ('https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
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
  test('7. Should update list', async ({ request }) => {
    // Arrange:
    const listForUpdateId = createdListsIds[createdListsIds.length - 1];
    const expectedStatusCode = 200;
    const updatedListName = 'Task with the highest priority';
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
});
