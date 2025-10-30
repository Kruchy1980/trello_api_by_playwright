import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareRandomChecklistDataSimplified } from '@_src/API/factories/simplified_factories/checklist-data.factory';
import { prepareRandomCheckItemDataSimplified } from '@_src/API/factories/simplified_factories/checklist_checkitems-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { asRecord } from '@_src/API/helpers/conversion_helpers/convert_as_record';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { ChecklistDataModel } from '@_src/API/models/checklist-data.model';
import { ChecklistCheckItemDataModel } from '@_src/API/models/checklist_checkitems-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { BoardRequest } from '@_src/API/requests/for_ROP_Requests/boardRequest';
import { CardRequest } from '@_src/API/requests/for_ROP_Requests/cardRequest';
import { ChecklistRequest } from '@_src/API/requests/for_ROP_Requests/checklistRequest';

import { headers, params } from '@_src/API/utils/api_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Improve to ROP (Request Object Pattern)
test.describe('CheckItems on checklists handling - ROP implemented', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  const createdChecklistsIds: string[] = [];
  const createdCheckItemsIds: string[] = [];

  test.beforeAll(
    'Board, card, checkLists preparation and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const boardRequest = new BoardRequest(request);
      // RUSO usage
      // const boardURL = boardRequest.buildUrl();
      const data: BoardDataModel = prepareRandomBoardDataSimplified();

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      // // RUSO Usage
      // const response = await boardRequest.sendRequest('post', boardURL, {
      //   headers,
      //   params,
      //   data,
      // });
      // RUSO Usage
      const response = await boardRequest.createBoard(data, params, headers);
      const responseJSON = await response.json();
      const { id: actualBoardId } = responseJSON;
      createdBoardId = actualBoardId;

      // Collect lists Id's
      // Assert:
      // RUSO usage
      // const getListsUrl = boardRequest.buildUrl(createdBoardId, 'lists');

      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      // // RUSO usage
      // const responseGetLists = await boardRequest.sendRequest(
      //   'get',
      //   getListsUrl,
      //   {
      //     headers,
      //     params,
      //   },
      // );
      // ROP usage
      const responseGetLists = await boardRequest.getBoardElements(
        createdBoardId,
        'lists',
        params,
        headers,
      );
      const responseGetListsJSON = await responseGetLists.json();
      responseGetListsJSON.forEach(({ id }: { id: string }) => {
        createdListsIds.push(id);
      });

      // Card Preparation
      // Arrange:
      const cardRequest = new CardRequest(request);
      // RUSO usage
      // const cardCreationURL = cardRequest.buildUrl();
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
      // // RUSO usage
      // const responseCardCreation = await cardRequest.sendRequest(
      //   'post',
      //   cardCreationURL,
      //   {
      //     headers,
      //     params,
      //     data: cardCreationData,
      //   },
      // );
      // ROP Usage
      const responseCardCreation = await cardRequest.createCard(
        cardCreationData,
        params,
        headers,
      );
      const responseCardCreationJSON = await responseCardCreation.json();

      const { id: actualCardId } = responseCardCreationJSON;

      createdCardId = actualCardId;

      // Checklists preparation
      const checklistRequest = new ChecklistRequest(request);
      for (let i = 0; i < 2; i++) {
        // Arrange:
        // RUSO Usage
        // const createChecklistUrl = checklistRequest.buildUrl();
        const checklistCreationData: ChecklistDataModel =
          prepareRandomChecklistDataSimplified(createdCardId, '');

        // Act: 'https://api.trello.com/1/checklists?idCard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
        // // RUSO Usage
        // const response = await checklistRequest.sendRequest(
        //   'post',
        //   createChecklistUrl,
        //   {
        //     headers,
        //     params,
        //     data: checklistCreationData,
        //   },
        // );
        // ROP Usage
        const response = await checklistRequest.createCheckList(
          checklistCreationData,
          params,
          headers,
        );
        const responseJSON = await response.json();
        const { id: actualChecklistId } = responseJSON;

        createdChecklistsIds.push(actualChecklistId);
      }
    },
  );

  test.beforeEach(
    'Create checkItems and move one top on checklist',
    async ({ request }) => {
      // Arrange:
      const checklistRequest = new ChecklistRequest(request);
      const checklistId = createdChecklistsIds[0];
      const expectedStatusCode = 200;
      // RUSO usage
      // const addAndMoveCheckItemUrl = checklistRequest.buildUrl(
      //   checklistId,
      //   'checkItems',
      // );
      const data: ChecklistCheckItemDataModel =
        prepareRandomCheckItemDataSimplified(
          `CheckItem for Checklist - ${checklistId}`,
          2,
        );
      const { name: expectedCheckItemName } = data;

      // Act: 'https://api.trello.com/1/checklists/{id}/checkItems?name={name}&key=APIKey&token=APIToken
      // // RUSO usage
      // const response = await checklistRequest.sendRequest(
      //   'post',
      //   addAndMoveCheckItemUrl,
      //   {
      //     headers,
      //     params,
      //     data,
      //   },
      // );
      // ROP usage
      const response = await checklistRequest.createCheckItem(
        checklistId,
        'checkItems',
        data,
        params,
        headers,
      );
      const responseJSON = await response.json();
      const { id: actualCheckItemId, name: actualCheckItemName } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualCheckItemName).toContain(expectedCheckItemName);

      // Other CheckItem Preparation
      // RUSO usage
      // const prepareCheckItemInTopURL = checklistRequest.buildUrl(
      //   checklistId,
      //   'checkItems',
      // );
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
      // // RUSO usage
      // const responseCheckItemTopCreation = await checklistRequest.sendRequest(
      //   'post',
      //   prepareCheckItemInTopURL,
      //   { headers, params, data: checkItemCreationTopData },
      // );
      // ROP usage
      const responseCheckItemTopCreation =
        await checklistRequest.createCheckItem(
          checklistId,
          'checkItems',
          checkItemCreationTopData,
          params,
          headers,
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
    const checklistRequest = new ChecklistRequest(request);
    const checklistId = createdChecklistsIds[0];
    const expectedStatusCode = 200;
    const expectedQuantityOfCheckItems = 2;
    // RUSO usage
    // const getCheckItemsUrl = checklistRequest.buildUrl(
    //   checklistId,
    //   'checkItems',
    // );

    // Act: https://api.trello.com/1/checklists/{id}/checkItems?key=APIKey&token=APIToken
    // // RUSO usage
    // const response = await checklistRequest.sendRequest(
    //   'get',
    //   getCheckItemsUrl,
    //   { headers, params },
    // );
    // ROP usage
    const response = await checklistRequest.getCheckItemFromChecklist(
      checklistId,
      'checkItems',
      params,
      headers,
    );
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
    const checklistRequest = new ChecklistRequest(request);
    const cardRequest = new CardRequest(request);
    await test.step('2.1 Should update and move checkItem to other checklist', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const cardId = createdCardId;
      const checkItemToMoveId = createdCheckItemsIds[1];
      const expectedCheckItemStatus = 'complete';
      // // RUSO Usage
      // const updateAndMoveCheckItemUrl = cardRequest.buildUrl(
      //   cardId,
      //   'checkItem',
      //   checkItemToMoveId,
      // );
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
      // !!! Correct path for this test uses cards: /1/cards/${cardId}/checkItem/${checkItemToMoveId}
      // // RUSO usage
      // const response = await cardRequest.sendRequest(
      //   'put',
      //   updateAndMoveCheckItemUrl,
      //   {
      //     headers,
      //     params: { ...params, ...updateCheckItemParams },
      //   },
      // );
      // RUSO usage
      const response = await cardRequest.editCardElement(
        cardId,
        'checkItem',
        checkItemToMoveId,
        asRecord(updateCheckItemParams),
        headers,
      );
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
      // RUSO Usage
      // const deleteCheckItemFromChecklistUrl = checklistRequest.buildUrl(
      //   checklistId,
      //   'checkItems',
      //   checkItemToDelete,
      // );

      // Act: https://api.trello.com/1/checklists/{id}/checkItems/{idCheckItem}?key=APIKey&token=APIToken
      // // RUSO Usage
      // const response = await checklistRequest.sendRequest(
      //   'delete',
      //   deleteCheckItemFromChecklistUrl,
      //   {
      //     headers,
      //     params,
      //   },
      // );
      // ROP Usage
      const response = await checklistRequest.deleteCheckItemFromChecklist(
        checklistId,
        'checkItems',
        checkItemToDelete,
        params,
        headers,
      );
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
      // RUSO Usage
      // const getDeletedCHeckItemUrl = checklistRequest.buildUrl(
      //   checklistId,
      //   'checkItems',
      //   checkItemDeleted,
      // );

      // Act: https://api.trello.com/1/checklists/{id}/checkItems/{idCheckItem}?key=APIKey&token=APIToken
      // RUSO Usage
      // const response = await checklistRequest.sendRequest(
      //   'get',
      //   getDeletedCHeckItemUrl,
      //   {
      //     headers,
      //     params,
      //   },
      // );
      // ROP Usage
      const response = await checklistRequest.getExactCheckItemFromChecklist(
        checklistId,
        'checkItems',
        checkItemDeleted,
        params,
        headers,
      );

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toContain(expectedStatusText);
    });
  });

  test.afterAll('Delete a board', async ({ request }) => {
    // Arrange:
    const boardRequest = new BoardRequest(request);
    // RUSO usage
    // const deleteBoardUrl = boardRequest.buildUrl(createdBoardId);

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    // // RUSO usage
    // await boardRequest.sendRequest('delete', deleteBoardUrl, {
    //   headers,
    //   params,
    // });
    // RUSO usage
    await boardRequest.deleteBoard(createdBoardId, params, headers);
  });
});
