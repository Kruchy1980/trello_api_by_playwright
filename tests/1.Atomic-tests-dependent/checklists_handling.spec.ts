import { API_KEY, TOKEN } from '@_config/env.config';
import { expect, test } from '@playwright/test';

test.describe.serial('Checklists_handling - dependent tests', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  let createdChecklistId: string;

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
  test('0.1 Collect Lists from Board', async ({ request }) => {
    // Arrange:
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
  });
  test('0.2. Card preparation', async ({ request }) => {
    // Arrange:
    const listId = createdListsIds[0];
    const expectedCardName = 'My first card for chwecklists name';
    const expectedCardDueDate = new Date(
      new Date().setDate(new Date().getDate() + 2),
    ).toISOString();
    //Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/cards?idList=${listId}&name=${expectedCardName}&due=${expectedCardDueDate}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdCardId = responseJSON.id;
  });
  test('1. Should Add checklist to card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedChecklistName = 'Checklist added by user';

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/checklists?idCard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/checklists?idCard=${createdCardId}&name=${expectedChecklistName}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdChecklistId = responseJSON.id;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualChecklistName = responseJSON.name;
    expect(actualChecklistName).toContain(expectedChecklistName);
  });
  test('2. Should Get a checklist data', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedChecklistName = 'Checklist added by user';

    //Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/checklists/${createdChecklistId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualChecklistId = responseJSON.id;
    expect(actualChecklistId).toContain(createdChecklistId);
    const actualChecklistName = responseJSON.name;
    expect(actualChecklistName).toContain(expectedChecklistName);
  });
  test('3. Should Update a checklist data', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const updatedChecklistName = 'Checklist added by user - once updated';
    const position = 'bottom';

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/checklists/${createdChecklistId}?name=${updatedChecklistName}&pos=${position}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualChecklistId = responseJSON.id;
    expect(actualChecklistId).toContain(createdChecklistId);
    const actualChecklistName = responseJSON.name;
    expect(actualChecklistName).toContain(updatedChecklistName);
  });
  test('4. Should Update a checklist name only', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const updatedChecklistName = 'Checklist updated name only';

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/checklists/{id}/{field}?value={value}&key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/checklists/${createdChecklistId}/name?value=${updatedChecklistName}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualChecklistId = responseJSON.id;
    expect(actualChecklistId).toContain(createdChecklistId);
    const actualChecklistName = responseJSON.name;
    expect(actualChecklistName).toContain(updatedChecklistName);
  });
  test('5. Should Get a checklist name only', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedChecklistName = 'Checklist updated name only';

    //Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/checklists/{id}/{field}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/checklists/${createdChecklistId}/name?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualChecklistName = responseJSON._value;
    expect(actualChecklistName).toContain(expectedChecklistName);
  });
  test('6. Should delete a checklist', async ({ request }) => {
    // !!! Nagrać w poniedziałek raz jeszcze z poprawnym
    // podejściem do asercji użycie metody toEqual nie toContain
    // Arrange:
    const expectedStatusCode = 200;
    const expectedResponseObject = {};

    //Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    const response = await request.delete(
      `/1/checklists/${createdChecklistId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualChecklistObject = responseJSON.limits;
    expect(actualChecklistObject).toEqual(expectedResponseObject);
  });
  test('7. (NP) Should NOT get deletedchecklist', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 404;
    const expectedStatusText = 'Not Found';

    //Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    const response = await request.delete(
      `/1/checklists/${createdChecklistId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(response.statusText()).toEqual(expectedStatusText);
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
