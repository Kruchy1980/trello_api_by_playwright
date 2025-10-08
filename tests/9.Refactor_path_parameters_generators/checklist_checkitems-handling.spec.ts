import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareRandomChecklistDataSimplified } from '@_src/API/factories/simplified_factories/checklist-data.factory';
import { prepareRandomCheckItemDataSimplified } from '@_src/API/factories/simplified_factories/checklist_checkitems-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { generatePathURLSimplified } from '@_src/API/helpers/path_params_generators/path_params_simplified_generator/simplified_path_parameters_generator';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { ChecklistDataModel } from '@_src/API/models/checklist-data.model';
import { ChecklistCheckItemDataModel } from '@_src/API/models/checklist_checkitems-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { pathParameters } from '@_src/API/utils/path_parameters_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Improve tests by destructuring objects
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation
test.describe('CheckItems on checklists handling - path_generators', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  const createdChecklistsIds: string[] = [];
  const createdCheckItemsIds: string[] = [];

  test.beforeAll(
    'Board, card, checkLists preparation and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const boardURL = generatePathURLSimplified(pathParameters.boardParameter);
      const data: BoardDataModel = prepareRandomBoardDataSimplified();

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      // const response = await request.post(`/1/boards`, {
      //   headers,
      //   params,
      //   data,
      // });
      const response = await request.post(boardURL, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      const { id: actualBoardId } = responseJSON;
      createdBoardId = actualBoardId;

      // Collect lists Id's
      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      const getListsUrl = generatePathURLSimplified(
        pathParameters.boardParameter,
        createdBoardId,
        'lists',
      );
      // const responseListsIds = await request.get(
      //   `/1/boards/${createdBoardId}/lists`,
      //   {
      //     headers,
      //     params,
      //   },
      // );
      const responseGetLists = await request.get(getListsUrl, {
        headers,
        params,
      });
      const responseGetListsJSON = await responseGetLists.json();
      responseGetListsJSON.forEach(({ id }: { id: string }) => {
        createdListsIds.push(id);
      });

      // Card Preparation
      // Arrange:
      const cardCreationURL = generatePathURLSimplified(
        pathParameters.cardParameter,
      );
      const cardCreationData: CardDataModel = prepareRandomCardDataSimplified(
        createdListsIds[0],
        'Card Name',
        undefined,
        undefined,
        undefined,
        true,
        1,
      );

      // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      // const responseCardCreation = await request.post(`/1/cards`, {
      //   headers,
      //   params,
      //   data: cardCreationData,
      // });
      const responseCardCreation = await request.post(cardCreationURL, {
        headers,
        params,
        data: cardCreationData,
      });
      const responseCardCreationJSON = await responseCardCreation.json();

      const { id: actualCardId } = responseCardCreationJSON;

      createdCardId = actualCardId;

      // Checklists preparation
      for (let i = 0; i < 2; i++) {
        // Arrange:
        const createChecklistUrl = generatePathURLSimplified(
          pathParameters.checklistParameter,
        );
        const checklistCreationData: ChecklistDataModel =
          prepareRandomChecklistDataSimplified(createdCardId, '');

        // Act: 'https://api.trello.com/1/checklists?idCard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
        // const response = await request.post(`/1/checklists`, {
        //   headers,
        //   params,
        //   data: checklistCreationData,
        // });
        const response = await request.post(createChecklistUrl, {
          headers,
          params,
          data: checklistCreationData,
        });
        const responseJSON = await response.json();
        const { id: actualChecklistId } = responseJSON;

        createdChecklistsIds.push(actualChecklistId);
      }
    },
  );

  test.beforeEach(
    'Create checkItems  and move one top on checklist',
    async ({ request }) => {
      // Arrange:
      const checklistId = createdChecklistsIds[0];
      const expectedStatusCode = 200;
      const addAndMoveCheckItemUrl = generatePathURLSimplified(
        pathParameters.checklistParameter,
        checklistId,
        'checkItems',
      );
      const data: ChecklistCheckItemDataModel =
        prepareRandomCheckItemDataSimplified(
          `CheckItem for Checklist - ${checklistId}`,
          2,
        );
      const { name: expectedCheckItemName } = data;

      // Act: 'https://api.trello.com/1/checklists/{id}/checkItems?name={name}&key=APIKey&token=APIToken
      // const response = await request.post(
      //   `/1/checklists/${checklistId}/checkItems`,
      //   { headers, params, data },
      // );
      const response = await request.post(addAndMoveCheckItemUrl, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      const { id: actualCheckItemId, name: actualCheckItemName } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualCheckItemName).toContain(expectedCheckItemName);

      // Other CheckItem Preparation
      // Arrange:
      const prepareCheckItemInTopURL = generatePathURLSimplified(
        pathParameters.checklistParameter,
        checklistId,
        'checkItems',
      );
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
      const { name: expectedCheckItemTopName } = checkItemCreationTopData;

      // Act: https://api.trello.com/1/checklists/{id}/checkItems?name={name}&key=APIKey&token=APIToken'
      // const responseCheckItemTopCreation = await request.post(
      //   `/1/checklists/${checklistId}/checkItems`,
      //   { headers, params, data: checkItemCreationTopData },
      // );
      const responseCheckItemTopCreation = await request.post(
        prepareCheckItemInTopURL,
        { headers, params, data: checkItemCreationTopData },
      );
      const responseCheckItemTopCreationJSON =
        await responseCheckItemTopCreation.json();
      const {
        id: actualCheckItemIdTop,
        name: actualCheckItemNameTop,
        state: actualCheckItemStatus,
      } = responseCheckItemTopCreationJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(responseCheckItemTopCreationJSON).toHaveProperty('pos');
      expect(actualCheckItemStatus).toContain(expectedCheckItemStatus);
      expect(actualCheckItemNameTop).toContain(expectedCheckItemTopName);

      createdCheckItemsIds.push(actualCheckItemId);
      createdCheckItemsIds.push(actualCheckItemIdTop);
    },
  );
  test('1. Should get checkItems from checklist', async ({ request }) => {
    // Arrange:
    const checklistId = createdChecklistsIds[0];
    const expectedStatusCode = 200;
    const expectedQuantityOfCheckItems = 2;
    const getCheckItemsUrl = generatePathURLSimplified(
      pathParameters.checklistParameter,
      checklistId,
      'checkItems',
    );

    // Act: https://api.trello.com/1/checklists/{id}/checkItems?key=APIKey&token=APIToken
    // const response = await request.get(
    //   `/1/checklists/${checklistId}/checkItems`,
    //   { headers, params },
    // );
    const response = await request.get(getCheckItemsUrl, { headers, params });
    const responseJSON = await response.json();
    responseJSON.forEach(({ id }: { id: string }) => {
      createdCheckItemsIds.push(id);
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
      const updateAndMoveCheckItemUrl = generatePathURLSimplified(
        pathParameters.cardParameter,
        cardId,
        'checkItem',
        checkItemToMoveId,
      );
      // console.log(updateAndMoveCheckItemUrl);
      const updateCheckItemParams: ParamsDataModel =
        prepareParamsDataSimplified(
          '',
          '',
          createdChecklistsIds[1],
          'Task Completed',
          true,
        );
      const { name: expectedCheckItemName } = updateCheckItemParams;

      // Act: https://api.trello.com/1/checklists/${checklistIdFrom}/checkItems/${checkItemId}?idChecklist=${checklistIdTo}&key=APIKey&token=APIToken
      // const response = await request.put(
      //   `/1/cards/${cardId}/checkItem/${checkItemToMoveId}`,
      //   {
      //     headers,
      //     params: { ...params, ...updateCheckItemParams },
      //   },
      // );
      const response = await request.put(updateAndMoveCheckItemUrl, {
        headers,
        params: { ...params, ...updateCheckItemParams },
      });
      // console.log(response.url());
      const responseJSON = await response.json();
      const { name: actualCheckItemName, state: actualCheckItemState } =
        responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualCheckItemName).toContain(expectedCheckItemName);
      expect(actualCheckItemState).toContain(expectedCheckItemStatus);
    });
    await test.step('2.2 Should Delete checkItem from checklist', async () => {
      // Arrange:
      const checklistId = createdChecklistsIds[1];
      const checkItemToDelete = createdCheckItemsIds[1];
      const expectedStatusCode = 200;
      const expectedResponseObject = {};
      const deleteCheckItemFromChecklistUrl = generatePathURLSimplified(
        pathParameters.checklistParameter,
        checklistId,
        'checkItems',
        checkItemToDelete,
      );

      // Act: https://api.trello.com/1/checklists/{id}/checkItems/{idCheckItem}?key=APIKey&token=APIToken
      // const response = await request.delete(
      //   `/1/checklists/${checklistId}/checkItems/${checkItemToDelete}`,
      //   { headers, params },
      // );
      const response = await request.delete(deleteCheckItemFromChecklistUrl, {
        headers,
        params,
      });
      const responseJSON = await response.json();
      const { limits: actualResponseLimitsObject } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualResponseLimitsObject).toEqual(expectedResponseObject);
    });
    await test.step('2.3 (NP) Should get Deleted checkItem from checklist', async () => {
      // Arrange:
      const checklistId = createdChecklistsIds[1];
      const checkItemDeleted = createdCheckItemsIds[1];
      const expectedStatusCode = 404;
      const expectedStatusText = 'Not Found';
      const getDeletedCHeckItemUrl = generatePathURLSimplified(
        pathParameters.checklistParameter,
        checklistId,
        'checkItems',
        checkItemDeleted,
      );

      // Act: https://api.trello.com/1/checklists/{id}/checkItems/{idCheckItem}?key=APIKey&token=APIToken
      // const response = await request.get(
      //   `/1/checklists/${checklistId}/checkItems/${checkItemDeleted}`,
      //   { headers, params },
      // );
      const response = await request.get(getDeletedCHeckItemUrl, {
        headers,
        params,
      });

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toContain(expectedStatusText);
    });
  });

  test.afterAll('Delete a board', async ({ request }) => {
    const deleteBoardUrl = generatePathURLSimplified(
      pathParameters.boardParameter,
      createdBoardId,
    );
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    // await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
    await request.delete(deleteBoardUrl, { headers, params });
  });
});
