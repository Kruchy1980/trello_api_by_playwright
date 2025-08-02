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
test.describe
  .serial('CheckItems on checklists handling - dependent tests', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  const createdChecklistsIds: string[] = [];
  const createdCheckItemsIds: string[] = [];

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
    const expectedCardName = 'My first card for checklists name';
    const expectedCardDueDate = new Date(
      new Date().setDate(new Date().getDate() + 2),
    ).toISOString();
    //Optional headers
    // const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/cards?idList=${listId}&name=${expectedCardName}&due=${expectedCardDueDate}`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdCardId = responseJSON.id;
  });
  test('0.3. Checklists preparation', async ({ request }) => {
    for (let i = 0; i < 2; i++) {
      // Arrange:
      const expectedChecklistName = `Checklist no_-${new Date().getMilliseconds()}`;
      //   console.log(expectedChecklistName);

      //Optional headers
      // const headers = { 'Content-Type': 'application/json' };

      // Act: 'https://api.trello.com/1/checklists?idCard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      const response = await request.post(
        `/1/checklists?idCard=${createdCardId}&name=${expectedChecklistName}`,
        { headers, params },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);
      createdChecklistsIds.push(responseJSON.id);
    }
    // console.log(createdChecklistsIds);
  });
  test('1. Should create checkItem on checklist', async ({ request }) => {
    // Arrange:
    const checklistId = createdChecklistsIds[0];
    const expectedStatusCode = 200;
    const expectedCheckItemName = `CheckItem for Checklist - ${checklistId}`;

    //Optional headers
    // const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/checklists/{id}/checkItems?name={name}&key=APIKey&token=APIToken
    const response = await request.post(
      `/1/checklists/${checklistId}/checkItems?name=${expectedCheckItemName}`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualCheckItemName = responseJSON.name;
    expect(actualCheckItemName).toContain(expectedCheckItemName);
  });
  test('2. Should create and move up checkItem on checklist', async ({
    request,
  }) => {
    // Arrange:
    const checklistId = createdChecklistsIds[0];
    const expectedCheckItemStatus = 'incomplete';
    const expectedStatusCode = 200;
    const expectedCheckItemName = `CheckItem - move when done to other checklist`;
    const position = 'top';
    const status = false;
    const dueDate = new Date(
      new Date().setDate(new Date().getDate() + 2),
    ).toISOString();

    //Optional headers
    // const headers = { 'Content-Type': 'application/json' };

    // Act: https://api.trello.com/1/checklists/{id}/checkItems?name={name}&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/checklists/${checklistId}/checkItems?name=${expectedCheckItemName}&pos=${position}&due=${dueDate}&checked=${status}`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('pos');
    const actualItemStatus = responseJSON.state;
    expect(actualItemStatus).toContain(expectedCheckItemStatus);
    const actualCheckItemName = responseJSON.name;
    expect(actualCheckItemName).toContain(expectedCheckItemName);
  });
  test('3. Should get checkItems from checklist', async ({ request }) => {
    // Arrange:
    const checklistId = createdChecklistsIds[0];
    const expectedStatusCode = 200;
    const expectedQuantityOfCheckItems = 2;

    //Optional headers
    // const headers = { Accept: 'application/json' };

    // Act: https://api.trello.com/1/checklists/{id}/checkItems?key=APIKey&token=APIToken
    const response = await request.get(
      `/1/checklists/${checklistId}/checkItems`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    responseJSON.forEach((el: { id: string }) => {
      createdCheckItemsIds.push(el.id);
    });
    // console.log(createdCheckItemsIds);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON.length).toBeGreaterThanOrEqual(
      expectedQuantityOfCheckItems,
    );
  });
  test('4. Should update and move checkItem to other checklist', async ({
    request,
  }) => {
    // Arrange:
    const cardId = createdCardId;
    const checklistIdTo = createdChecklistsIds[1];
    const checkItemToMoveId = createdCheckItemsIds[1];
    const expectedStatusCode = 200;
    const updatedCheckItemName = 'Task completed';
    const status = true;
    const expectedCheckItemStatus = 'complete';

    //Optional headers
    // const headers = { 'Content-Type': 'application/json' };

    // Act: https://api.trello.com/1/checklists/${checklistIdFrom}/checkItems/${checkItemId}?idChecklist=${checklistIdTo}&key=APIKey&token=APIToken
    const response = await request.put(
      `/1/cards/${cardId}/checkItem/${checkItemToMoveId}?name=${updatedCheckItemName}&state=${status}&idChecklist=${checklistIdTo}`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualCheckItemName = responseJSON.name;
    expect(actualCheckItemName).toContain(updatedCheckItemName);
    const actualCheckItemState = responseJSON.state;
    expect(actualCheckItemState).toContain(expectedCheckItemStatus);
  });
  test('5. Should Delete checkItem from checklist', async ({ request }) => {
    // Arrange:
    const checklistId = createdChecklistsIds[1];
    const checkItemToDelete = createdCheckItemsIds[1];
    const expectedStatusCode = 200;
    const expectedResponseObject = {};

    //Optional headers
    // const headers = { 'Content-Type': 'application/json' };

    // Act: https://api.trello.com/1/checklists/{id}/checkItems/{idCheckItem}?key=APIKey&token=APIToken
    const response = await request.delete(
      `/1/checklists/${checklistId}/checkItems/${checkItemToDelete}`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualResponseObject = responseJSON.limits;
    expect(actualResponseObject).toEqual(expectedResponseObject);
  });
  test('6.(NP) Should get Deleted checkItem from checklist', async ({
    request,
  }) => {
    // Arrange:
    const checklistId = createdChecklistsIds[1];
    const checkItemDeleted = createdCheckItemsIds[1];
    const expectedStatusCode = 404;
    const expectedStatusText = 'Not Found';

    //Optional headers
    // const headers = { Accept: 'application/json' };

    // Act: https://api.trello.com/1/checklists/{id}/checkItems/{idCheckItem}?key=APIKey&token=APIToken
    const response = await request.get(
      `/1/checklists/${checklistId}/checkItems/${checkItemDeleted}`,
      { headers, params },
    );
    // console.log(response);
    // const responseJSON = await response.json();
    // console.log(responseJSON);

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
