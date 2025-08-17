import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { ChecklistDataModel } from '@_src/API/models/checklist-data.model';
import { ChecklistCheckItemDataModel } from '@_src/API/models/checklist_checkitems-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
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
  // let data: { [key: string]: string | boolean };

  test.beforeAll(
    'Board, card, checkLists preparation and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const data: BoardDataModel = {
        name: `My Board - ${new Date().toISOString().split('T')[1].split('Z')[0]}`,
      };

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      const response = await request.post(`/1/boards`, {
        headers,
        params,
        data,
      });
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
      const cardCreationData: CardDataModel = {
        idList: createdListsIds[0],
        name: 'My first card for comments name',
        due: new Date(
          new Date().setDate(new Date().getDate() + 2),
        ).toISOString(),
      };

      // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      const responseCardCreation = await request.post(`/1/cards`, {
        headers,
        params,
        data: cardCreationData,
      });
      const responseCardCreationJSON = await responseCardCreation.json();
      // console.log(responseJSON);
      createdCardId = responseCardCreationJSON.id;

      // Checklists preparation
      for (let i = 0; i < 2; i++) {
        // Arrange:
        const checklistCreationData: ChecklistDataModel = {
          idCard: createdCardId,
          name: `Checklist no_-${new Date().getMilliseconds()}`,
        };

        // Act: 'https://api.trello.com/1/checklists?idCard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
        const response = await request.post(`/1/checklists`, {
          headers,
          params,
          data: checklistCreationData,
        });
        const responseJSON = await response.json();
        // console.log(responseJSON);
        createdChecklistsIds.push(responseJSON.id);
      }
    },
  );

  test.beforeEach(
    'Create checkItems  and move one top on checklist',
    async ({ request }) => {
      // Arrange:
      const checklistId = createdChecklistsIds[0];
      const expectedStatusCode = 200;
      const data: ChecklistCheckItemDataModel = {
        name: `CheckItem for Checklist - ${checklistId}`,
      };

      // Act: 'https://api.trello.com/1/checklists/{id}/checkItems?name={name}&key=APIKey&token=APIToken
      const response = await request.post(
        `/1/checklists/${checklistId}/checkItems`,
        { headers, params, data },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualCheckItemName = responseJSON.name;
      expect(actualCheckItemName).toContain(data.name);

      // Other CheckItem Preparation
      // Arrange:
      const expectedCheckItemStatus = 'incomplete';
      const checkItemCreationTopData: ChecklistCheckItemDataModel = {
        name: `CheckItem - move when done to other checklist`,
        pos: 'top',
        due: new Date(
          new Date().setDate(new Date().getDate() + 2),
        ).toISOString(),
        checked: false,
      };

      // Act: https://api.trello.com/1/checklists/{id}/checkItems?name={name}&key=APIKey&token=APIToken'
      const responseCheckItemTopCreation = await request.post(
        `/1/checklists/${checklistId}/checkItems`,
        { headers, params, data: checkItemCreationTopData },
      );
      const responseCheckItemTopCreationJSON =
        await responseCheckItemTopCreation.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(responseCheckItemTopCreationJSON).toHaveProperty('pos');
      const actualItemStatus = responseCheckItemTopCreationJSON.state;
      expect(actualItemStatus).toContain(expectedCheckItemStatus);
      const actualCheckItemNameTop = responseCheckItemTopCreationJSON.name;
      expect(actualCheckItemNameTop).toContain(checkItemCreationTopData.name);

      // Add CheckItems ids to Array
      createdCheckItemsIds.push(responseJSON.id);
      createdCheckItemsIds.push(responseCheckItemTopCreationJSON.id);
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
    responseJSON.forEach((el: { id: string }) => {
      createdCheckItemsIds.push(el.id);
    });

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

      const updateCheckItemParams: ParamsDataModel = {
        key: params.key,
        token: params.token,
        idChecklist: createdChecklistsIds[1],
        name: 'Task completed',
        state: true,
      };

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

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualCheckItemName = responseJSON.name;
      expect(actualCheckItemName).toContain(updateCheckItemParams.name);
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
