import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';
// TODO: For refactoring
// TODO: Remove duplicated headers from tests
// TODO: Separate auth keys from URL
// TODO: Make tests independent
// TODO: Prepare models for data generation
// TODO: Prepare factories for models handling
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe.serial('Checklists_handling - dependent tests', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  let createdChecklistId: string;
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
  test('0.1 Collect Lists from Board', async ({ request }) => {
    // Arrange:
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
  });
  test('0.2. Card preparation', async ({ request }) => {
    // Arrange:
    const listId = createdListsIds[0];
    const expectedCardName = 'My first card for chwecklists name';
    const expectedCardDueDate = new Date(
      new Date().setDate(new Date().getDate() + 2),
    ).toISOString();

    // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/cards?idList=${listId}&name=${expectedCardName}&due=${expectedCardDueDate}`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdCardId = responseJSON.id;
  });
  test('1. Should Add checklist to card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedChecklistName = 'Checklist added by user';

    // Act: 'https://api.trello.com/1/checklists?idCard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/checklists?idCard=${createdCardId}&name=${expectedChecklistName}`,
      { headers, params },
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
    // const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    const response = await request.get(`/1/checklists/${createdChecklistId}`, {
      headers,
      params,
    });
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
    // const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/checklists/${createdChecklistId}?name=${updatedChecklistName}&pos=${position}`,
      { headers, params },
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
    // const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/checklists/{id}/{field}?value={value}&key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/checklists/${createdChecklistId}/name?value=${updatedChecklistName}`,
      { headers, params },
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
    // const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/checklists/{id}/{field}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/checklists/${createdChecklistId}/name`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualChecklistName = responseJSON._value;
    expect(actualChecklistName).toContain(expectedChecklistName);
  });
  test('6. Should delete a checklist', async ({ request }) => {
    //Arrange:
    const expectedStatusCode = 200;
    const expectedResponseObject = {};

    //Optional headers
    // const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    const response = await request.delete(
      `/1/checklists/${createdChecklistId}`,
      { headers, params },
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
    // const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    const response = await request.delete(
      `/1/checklists/${createdChecklistId}`,
      { headers, params },
    );

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(response.statusText()).toEqual(expectedStatusText);
  });
  test('Delete a board', async ({ request }) => {
    // Arrange:
    //Optional headers
    // const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
  });
});
