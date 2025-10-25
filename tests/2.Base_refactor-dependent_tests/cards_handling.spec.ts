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

test.describe.serial('Cards handling - dependent tests', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  let updatedCardDueDate: string;
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
  test('1. Should create a new Card', async ({ request }) => {
    // Arrange:
    const listId = createdListsIds[0];
    const expectedStatusCode = 200;
    const expectedCardName = 'My first card name';
    const expectedCardDescription = 'My first card Description';
    const expectedCardDueDate = new Date().toISOString();
    //Optional headers
    // const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/cards?idList=${listId}&name=${expectedCardName}&desc=${expectedCardDescription}&due=${expectedCardDueDate}`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdCardId = responseJSON.id;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    const actualCardName = responseJSON.name;
    expect(actualCardName).toContain(expectedCardName);
    const actualCardDescription = responseJSON.desc;
    expect(actualCardDescription).toContain(expectedCardDescription);
    const actualCardDueDate = responseJSON.due;
    expect(actualCardDueDate).toContain(expectedCardDueDate);
  });
  test('2. Should update a Card', async ({ request }) => {
    // Arrange:
    // const listId = createdListsIds[0];
    const expectedStatusCode = 200;
    const updatedCardName = 'My first card name - update';
    updatedCardDueDate = new Date(
      new Date().setDate(new Date().getDate() + 2),
    ).toISOString();
    //Optional headers
    // const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/cards/${createdCardId}?name=${updatedCardName}&due=${updatedCardDueDate}`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualCardId = responseJSON.id;
    expect(actualCardId).toContain(createdCardId);
    const actualCardName = responseJSON.name;
    expect(actualCardName).toContain(updatedCardName);

    const actualCardDueDate = responseJSON.due;
    expect(actualCardDueDate).toContain(updatedCardDueDate);
  });
  test('3. Should get a Card fields', async ({ request }) => {
    // Arrange:
    // const listId = createdListsIds[0];
    const expectedStatusCode = 200;
    const expectedCardName = 'My first card name - update';
    const expectedCardDescription = 'My first card Description';

    //Optional headers
    // const headers = { Accept: 'application/json' };

    // Act: ('https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/cards/${createdCardId}?fields=name,desc,due`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualCardId = responseJSON.id;
    expect(actualCardId).toContain(createdCardId);
    const actualCardName = responseJSON.name;
    expect(actualCardName).toContain(expectedCardName);
    const actualCardDescription = responseJSON.desc;
    expect(actualCardDescription).toContain(expectedCardDescription);
    const actualCardDueDate = responseJSON.due;
    expect(actualCardDueDate).toContain(updatedCardDueDate);
  });
  test('4. Should delete a Card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedResponseObject = '{}';

    //Optional headers
    // const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
    const response = await request.delete(`/1/cards/${createdCardId}`, {
      headers,
      params,
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualResponseObject = JSON.stringify(responseJSON.limits);
    expect(actualResponseObject).toContain(expectedResponseObject);
  });
  test('5. (NP) Should NOT get deleted card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 404;
    const expectedStatusText = 'Not Found';

    //Optional headers
    // const headers = { Accept: 'application/json' };

    // Act: ('https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/cards/${createdCardId}?fields=name,desc,due`,
      { headers, params },
    );

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(response.statusText()).toContain(expectedStatusText);
  });
  test('Delete a board', async ({ request }) => {
    // Arrange:
    //Optional headers
    // const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
  });
});
