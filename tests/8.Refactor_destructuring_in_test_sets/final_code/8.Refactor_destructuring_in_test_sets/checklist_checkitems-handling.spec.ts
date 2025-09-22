import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareRandomChecklistDataSimplified } from '@_src/API/factories/simplified_factories/checklist-data.factory';
import { prepareRandomCheckItemDataSimplified } from '@_src/API/factories/simplified_factories/checklist_checkitems-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { ChecklistDataModel } from '@_src/API/models/checklist-data.model';
import { ChecklistCheckItemDataModel } from '@_src/API/models/checklist_checkitems-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Improve tests by destructuring objects
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation
test.describe('CheckItems on checklists handling - destructured', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  const createdChecklistsIds: string[] = [];
  const createdCheckItemsIds: string[] = [];

  test.beforeAll(
    'Board, card, checkLists preparation and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const data: BoardDataModel = prepareRandomBoardDataSimplified();

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      const response = await request.post(`/1/boards`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);
      // Destructuring responseJSON object
      const { id: expectedBoardId } = responseJSON;
      // Before Destructuring
      // createdBoardId = responseJSON.id;
      // Before Destructuring
      createdBoardId = expectedBoardId;

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
      // Before destructuring:
      // responseListsIdsJSON.forEach((listId: { id: string }) => {
      //   createdListsIds.push(listId.id);
      // After destructuring - destructure inside loop
      responseListsIdsJSON.forEach(({ id }: { id: string }) => {
        createdListsIds.push(id);
      });

      // Card Preparation
      // Arrange:
      const cardCreationData: CardDataModel = prepareRandomCardDataSimplified(
        createdListsIds[0],
        'Card Name',
        undefined,
        undefined,
        undefined,
        true,
        1,
      );
      // console.log('Create card data:',cardCreationData);

      // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      const responseCardCreation = await request.post(`/1/cards`, {
        headers,
        params,
        data: cardCreationData,
      });
      const responseCardCreationJSON = await responseCardCreation.json();
      // console.log(responseJSON);
      // Destructuring JSON Object
      const { id: expectedCardId } = responseCardCreationJSON;

      // Before destructuring
      // createdCardId = responseCardCreationJSON.id;
      // After destructuring
      createdCardId = expectedCardId;

      // Checklists preparation
      for (let i = 0; i < 2; i++) {
        // Arrange:
        const checklistCreationData: ChecklistDataModel =
          prepareRandomChecklistDataSimplified(createdCardId, '');
        // console.log('Before All checklist:', checklistCreationData);

        // Act: 'https://api.trello.com/1/checklists?idCard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
        const response = await request.post(`/1/checklists`, {
          headers,
          params,
          data: checklistCreationData,
        });
        const responseJSON = await response.json();
        // console.log(responseJSON);
        // Destructuring JSON response object
        const { id: expectedChecklistId } = responseJSON;
        // Before destructuring
        // createdChecklistsIds.push(responseJSON.id);
        // After destructuring
        createdChecklistsIds.push(expectedChecklistId);
      }
    },
  );

  test.beforeEach(
    'Create checkItems  and move one top on checklist',
    async ({ request }) => {
      // Arrange:
      const checklistId = createdChecklistsIds[0];
      const expectedStatusCode = 200;
      const data: ChecklistCheckItemDataModel =
        prepareRandomCheckItemDataSimplified(
          `CheckItem for Checklist - ${checklistId}`,
          2,
        );
      // console.log('My new checkItem', data);
      // Destructuring data object
      const { name: expectedCheckItemName } = data;

      // Act: 'https://api.trello.com/1/checklists/{id}/checkItems?name={name}&key=APIKey&token=APIToken
      const response = await request.post(
        `/1/checklists/${checklistId}/checkItems`,
        { headers, params, data },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);
      // Destructuring responseJSON object
      const { id: actualCheckItemId, name: actualCheckItemName } = responseJSON;

      // Assert:
      // Before destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualCheckItemName = responseJSON.name;
      // expect(actualCheckItemName).toContain(data.name);
      // After destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualCheckItemName = responseJSON.name;
      expect(actualCheckItemName).toContain(expectedCheckItemName);

      // Other CheckItem Preparation
      // Arrange:
      const expectedCheckItemStatus = 'incomplete';
      const checkItemCreationTopData: ChecklistCheckItemDataModel =
        prepareRandomCheckItemDataSimplified(
          'New checkItem',
          2,
          true,
          2,
          'top',
          false,
        );
      // console.log('Other checkItem moved top:', checkItemCreationTopData);
      // Destructuring data object
      const { name: expectedCheckItemTopName } = checkItemCreationTopData;
      // console.log(expectedCheckItemTopName);
      // Act: https://api.trello.com/1/checklists/{id}/checkItems?name={name}&key=APIKey&token=APIToken'
      const responseCheckItemTopCreation = await request.post(
        `/1/checklists/${checklistId}/checkItems`,
        { headers, params, data: checkItemCreationTopData },
      );
      const responseCheckItemTopCreationJSON =
        await responseCheckItemTopCreation.json();
      // console.log(responseJSON);
      // Destructuring responseJSON object
      const {
        id: actualCheckItemIdTop,
        name: actualCheckItemNameTop,
        state: actualCheckItemStatus,
      } = responseCheckItemTopCreationJSON;

      // Assert:
      // Before destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // expect(responseCheckItemTopCreationJSON).toHaveProperty('pos');
      // const actualCheckItemStatus = responseCheckItemTopCreationJSON.state;
      // expect(actualCheckItemStatus).toContain(expectedCheckItemStatus);
      // const actualCheckItemNameTop = responseCheckItemTopCreationJSON.name;
      // expect(actualCheckItemNameTop).toContain(checkItemCreationTopData.name);
      // After destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      expect(responseCheckItemTopCreationJSON).toHaveProperty('pos');
      // const actualCheckItemStatus = responseCheckItemTopCreationJSON.state;
      expect(actualCheckItemStatus).toContain(expectedCheckItemStatus);
      // const actualCheckItemNameTop = responseCheckItemTopCreationJSON.name;
      expect(actualCheckItemNameTop).toContain(expectedCheckItemTopName);

      // === Add CheckItems ids to Array ===
      // Before destructuring
      // createdCheckItemsIds.push(responseJSON.id);
      // createdCheckItemsIds.push(responseCheckItemTopCreationJSON.id);
      // After destructuring
      createdCheckItemsIds.push(actualCheckItemId);
      createdCheckItemsIds.push(actualCheckItemIdTop);
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
    // Before destructing
    // responseJSON.forEach((el: { id: string }) => {
    //   createdCheckItemsIds.push(el.id);
    // });
    // After destructing
    responseJSON.forEach(({ id }: { id: string }) => {
      createdCheckItemsIds.push(id);
    });
    // No destructuring needed because verifying full object length

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON.length).toBeGreaterThanOrEqual(
      expectedQuantityOfCheckItems,
    );
  });

  test('2. Update checkItem, move to other checkList, delete and verify success', async ({
    request,
  }) => {
    await test.step('2.1 Should update and move checkItem to other checklist', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const cardId = createdCardId;
      const checkItemToMoveId = createdCheckItemsIds[1];
      const expectedCheckItemStatus = 'complete';
      const updateCheckItemParams: ParamsDataModel =
        prepareParamsDataSimplified(
          '',
          '',
          createdChecklistsIds[1],
          'Task Completed',
          true,
        );
      // console.log(updateCheckItemParams);
      // Destructuring params object
      const { name: expectedCheckItemName } = updateCheckItemParams;

      // Act: https://api.trello.com/1/checklists/${checklistIdFrom}/checkItems/${checkItemId}?idChecklist=${checklistIdTo}&key=APIKey&token=APIToken
      const response = await request.put(
        `/1/cards/${cardId}/checkItem/${checkItemToMoveId}`,
        {
          headers,
          params: { ...params, ...updateCheckItemParams },
        },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);
      // Destructuring responseJSON object
      const { name: actualCheckItemName, state: actualCheckItemState } =
        responseJSON;

      // Assert:
      // Before Destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualCheckItemName = responseJSON.name;
      // expect(actualCheckItemName).toContain(updateCheckItemParams.name);
      // const actualCheckItemState = responseJSON.state;
      // expect(actualCheckItemState).toContain(expectedCheckItemStatus);
      // After Destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualCheckItemName = responseJSON.name;
      expect(actualCheckItemName).toContain(expectedCheckItemName);
      // const actualCheckItemState = responseJSON.state;
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
      // Destructuring responseJSON object
      const { limits: actualResponseLimitsObject } = responseJSON;

      // Assert:
      // // Before Destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualResponseLimitsObject = responseJSON.limits;
      // expect(actualResponseLimitsObject).toEqual(expectedResponseObject);
      // After Destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualResponseLimitsObject = responseJSON.limits;
      expect(actualResponseLimitsObject).toEqual(expectedResponseObject);
    });
    await test.step('2.3 (NP) Should get Deleted checkItem from checklist', async () => {
      // Arrange: !! No destructuring needed
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
