import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Make tests independent
// TODO: Prepare models for data generation
// TODO: Prepare factories for models handling
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation
test.describe('CheckItems on checklists handling - independent tests', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  const createdChecklistsIds: string[] = [];
  const createdCheckItemsIds: string[] = [];

  test.beforeAll(
    'Board, card preparation and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const expectedBoardName = `My Board - ${new Date().toISOString().split('T')[1].split('Z')[0]}`;

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      const response = await request.post(
        `/1/boards/?name=${expectedBoardName}`,
        { headers, params },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);
      createdBoardId = responseJSON.id;

      // Collect lists Id's
      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      const responseListsIds = await request.get(
        `/1/boards/${createdBoardId}/lists`,
        {
          headers,
          params,
        },
      );
      const responseListsIdsJSON = await responseListsIds.json();
      // console.log(responseJSON);
      responseListsIdsJSON.forEach((listId: { id: string }) => {
        createdListsIds.push(listId.id);
      });

      // Card Preparation
      // Arrange:
      const listId = createdListsIds[0];
      const expectedCardName = `Card for labels - ${new Date().getTime()}`;
      const expectedCardDueDate = new Date(
        new Date().setDate(new Date().getDate() + 1),
      ).toISOString();

      // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      const responseCreatedCard = await request.post(
        `/1/cards?idList=${listId}&name=${expectedCardName}&due=${expectedCardDueDate}`,
        { headers, params },
      );
      const responseCreatedCardJSON = await responseCreatedCard.json();
      // console.log(responseJSON);
      createdCardId = responseCreatedCardJSON.id;

      // Checklists preparation
      for (let i = 0; i < 2; i++) {
        // Arrange:
        const expectedChecklistName = `Checklist no_-${new Date().getMilliseconds()}`;
        //   console.log(expectedChecklistName);

        // Act: 'https://api.trello.com/1/checklists?idCard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
        const response = await request.post(
          `/1/checklists?idCard=${createdCardId}&name=${expectedChecklistName}`,
          { headers, params },
        );
        const responseJSON = await response.json();
        // console.log(responseJSON);
        createdChecklistsIds.push(responseJSON.id);
      }
    },
  );

  test.beforeEach(
    'Create checkItems on checklist and move one up',
    async ({ request }) => {
      // Arrange:
      const checklistId = createdChecklistsIds[0];
      const expectedStatusCode = 200;
      const expectedCheckItemName = `CheckItem for Checklist - ${checklistId}`;

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

      // Create checkItem and move up
      // Arrange:
      // const checklistId = createdChecklistsIds[0];
      const expectedCheckItemStatus = 'incomplete';
      // const expectedStatusCode = 200;
      const expectedCheckItemNameTop = `CheckItem - move when done to other checklist`;
      const position = 'top';
      const status = false;
      const dueDate = new Date(
        new Date().setDate(new Date().getDate() + 2),
      ).toISOString();

      // Act: https://api.trello.com/1/checklists/{id}/checkItems?name={name}&key=APIKey&token=APIToken'
      const responseTopCheckItem = await request.post(
        `/1/checklists/${checklistId}/checkItems?name=${expectedCheckItemNameTop}&pos=${position}&due=${dueDate}&checked=${status}`,
        { headers, params },
      );
      const responseTopCheckItemJSON = await responseTopCheckItem.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(responseTopCheckItemJSON).toHaveProperty('pos');
      const actualItemStatus = responseTopCheckItemJSON.state;
      expect(actualItemStatus).toContain(expectedCheckItemStatus);
      const actualCheckItemNameTop = responseTopCheckItemJSON.name;
      expect(actualCheckItemNameTop).toContain(expectedCheckItemNameTop);
      // Add checkitems ids to ids array
      createdCheckItemsIds.push(responseJSON.id);
      createdCheckItemsIds.push(responseTopCheckItemJSON.id);
    },
  );
  test('1. Should get checkItems from checklist', async ({ request }) => {
    // Arrange:
    const checklistId = createdChecklistsIds[0];
    const expectedStatusCode = 200;
    const expectedQuantityOfCheckItems = 2;

    // Act: https://api.trello.com/1/checklists/{id}/checkItems?key=APIKey&token=APIToken
    const response = await request.get(
      `/1/checklists/${checklistId}/checkItems`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // responseJSON.forEach((el: { id: string }) => {
    //   createdCheckItemsIds.push(el.id);
    // });
    // console.log(createdCheckItemsIds);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON.length).toBeGreaterThanOrEqual(
      expectedQuantityOfCheckItems,
    );
  });

  test('2. Update and move checkItem to other checklist, delete the checkItem and verify success', async ({
    request,
  }) => {
    await test.step('2.1 Should update and move checkItem to other checklist', async () => {
      // Arrange:
      const cardId = createdCardId;
      const checklistIdTo = createdChecklistsIds[1];
      const checkItemToMoveId = createdCheckItemsIds[1];
      const expectedStatusCode = 200;
      const updatedCheckItemName = 'Task completed';
      const status = true;
      const expectedCheckItemStatus = 'complete';

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
    await test.step('2.2 Should Delete checkItem from checklist', async () => {
      // Arrange:
      const checklistId = createdChecklistsIds[1];
      const checkItemToDelete = createdCheckItemsIds[1];
      const expectedStatusCode = 200;
      const expectedResponseObject = {};

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
    await test.step('2.3 (NP) Should get Deleted checkItem from checklist', async () => {
      // Arrange:
      const checklistId = createdChecklistsIds[1];
      const checkItemDeleted = createdCheckItemsIds[1];
      const expectedStatusCode = 404;
      const expectedStatusText = 'Not Found';

      // Act: https://api.trello.com/1/checklists/{id}/checkItems/{idCheckItem}?key=APIKey&token=APIToken
      const response = await request.get(
        `/1/checklists/${checklistId}/checkItems/${checkItemDeleted}`,
        { headers, params },
      );

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toContain(expectedStatusText);
    });
  });

  test.afterAll('Delete a board', async ({ request }) => {
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
  });
});
