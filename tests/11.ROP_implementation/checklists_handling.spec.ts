import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareRandomChecklistDataSimplified } from '@_src/API/factories/simplified_factories/checklist-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { ChecklistDataModel } from '@_src/API/models/checklist-data.model';
import { BoardRequest } from '@_src/API/requests/for_ROP_Requests/boardRequest';
import { CardRequest } from '@_src/API/requests/for_ROP_Requests/cardRequest';
import { ChecklistRequest } from '@_src/API/requests/for_ROP_Requests/checklistRequest';

import { headers, params } from '@_src/API/utils/api_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Improve to ROP (Request Object Model)

test.describe('Checklists_handling - RU_SO implemented', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  let createdChecklistId: string;
  let data: ChecklistDataModel;
  test.beforeAll(
    'Board, card preparation and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const boardRequest = new BoardRequest(request);
      // RUSO usage
      // const boardURL = boardRequest.buildUrl();
      const data: BoardDataModel = prepareRandomBoardDataSimplified();

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      // // RUSO usage
      // const response = await boardRequest.sendRequest('post', boardURL, {
      //   headers,
      //   params,
      //   data,
      // });
      // ROP usage
      const response = await boardRequest.createBoard(data, params, headers);
      const responseJSON = await response.json();
      const { id: actualBoardId } = responseJSON;
      createdBoardId = actualBoardId;

      // Collect lists Id's
      // Arrange:
      // RUSO usage
      // const getListsUrl = boardRequest.buildUrl(createdBoardId, 'lists');

      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      // // RUSO Usage
      // const responseGetLists = await boardRequest.sendRequest(
      //   'get',
      //   getListsUrl,
      //   {
      //     headers,
      //     params,
      //   },
      // );
      // ROP Usage
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
        'My first card for comments name',
        undefined,
        undefined,
        undefined,
        true,
      );

      // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      // // RUSO usage
      // const responseCardCreation = await cardRequest.sendRequest(cardCreationURL, {
      //   headers,
      //   params,
      //   data: cardCreationData,
      // });
      // ROP usage
      const responseCardCreation = await cardRequest.createCard(
        cardCreationData,
        params,
        headers,
      );
      const responseCardCreationJSON = await responseCardCreation.json();
      const { id: actualCardCreationId } = responseCardCreationJSON;

      createdCardId = actualCardCreationId;
    },
  );

  test.beforeEach('Add checklist to card', async ({ request }) => {
    // Arrange:
    const checklistRequest = new ChecklistRequest(request);
    const expectedStatusCode = 200;
    // RUSO Usage
    // const addChecklistToCardUrl = checklistRequest.buildUrl();
    data = prepareRandomChecklistDataSimplified(createdCardId, '', 3);
    const { name: expectedChecklistName } = data;

    // Act: 'https://api.trello.com/1/checklists?idCard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    // // RUSO usage
    // const response = await checklistRequest.sendRequest(
    //   'post',
    //   addChecklistToCardUrl,
    //   {
    //     headers,
    //     params,
    //     data,
    //   },
    // );
    // ROP usage
    const response = await checklistRequest.createCheckList(
      data,
      params,
      headers,
    );
    const responseJSON = await response.json();
    const { id: actualChecklistId, name: actualChecklistName } = responseJSON;

    // // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(actualChecklistName).toContain(expectedChecklistName);

    createdChecklistId = actualChecklistId;
  });
  test('1. Should Get a checklist data', async ({ request }) => {
    // Arrange:
    const checklistRequest = new ChecklistRequest(request);
    const expectedStatusCode = 200;
    // RUSO usage
    // const getChecklistUrl = checklistRequest.buildUrl(createdChecklistId);

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    // // RUSO usage
    // const response = await checklistRequest.sendRequest(
    //   'get',
    //   getChecklistUrl,
    //   {
    //     headers,
    //     params,
    //   },
    // );
    // ROP usage
    const response = await checklistRequest.getCheckList(
      createdChecklistId,
      params,
      headers,
    );
    const responseJSON = await response.json();
    const { id: actualChecklistId, name: actualChecklistName } = responseJSON;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(actualChecklistId).toContain(createdChecklistId);
    expect(actualChecklistName).toContain(data.name);
  });
  test('2. Should Update a checklist data', async ({ request }) => {
    // Arrange:
    const checklistRequest = new ChecklistRequest(request);
    const expectedStatusCode = 200;
    // RUSO usage
    // const updateChecklistData = checklistRequest.buildUrl(createdChecklistId);
    const data: ChecklistDataModel = prepareRandomChecklistDataSimplified(
      '',
      'Checklist added by user - once updated',
      undefined,
      'bottom',
    );
    const { name: expectedChecklistName } = data;

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    // // RUSO usage
    // const response = await checklistRequest.sendRequest(
    //   'put',
    //   updateChecklistData,
    //   {
    //     headers,
    //     params,
    //     data,
    //   },
    // );
    // ROP usage
    const response = await checklistRequest.updateCheckList(
      createdChecklistId,
      data,
      params,
      headers,
    );
    const responseJSON = await response.json();
    const { id: actualChecklistId, name: actualChecklistName } = responseJSON;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(actualChecklistId).toContain(createdChecklistId);
    expect(actualChecklistName).toContain(expectedChecklistName);
  });

  test('3. Update and verify checklist name', async ({ request }) => {
    const checklistRequest = new ChecklistRequest(request);
    let checklistDataForVerification: string | undefined;
    await test.step('3.1 Should Update a checklist name only', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      // RUSO usage
      // const updateChecklistNameUrl = checklistRequest.buildUrl(
      //   createdChecklistId,
      //   'name',
      // );
      const data: ChecklistDataModel = prepareRandomChecklistDataSimplified(
        undefined,
        undefined,
        undefined,
        undefined,
        'Checklist updated name only',
        2,
      );
      const { value: expectedChecklistName } = data;

      // Act: 'https://api.trello.com/1/checklists/{id}/{field}?value={value}&key=APIKey&token=APIToken'
      // // RUSO usage
      // const response = await checklistRequest.sendRequest(
      //   'put',
      //   updateChecklistNameUrl,
      //   {
      //     headers,
      //     params,
      //     data,
      //   },
      // );
      // RUSO usage
      const response = await checklistRequest.updateCheckListField(
        createdChecklistId,
        'name',
        data,
        params,
        headers,
      );
      const responseJSON = await response.json();
      const { id: actualChecklistId, name: actualChecklistName } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualChecklistId).toContain(createdChecklistId);
      expect(actualChecklistName).toContain(expectedChecklistName);
      checklistDataForVerification = expectedChecklistName;
    });
    await test.step('3.2 Should Get a checklist name only', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      // RUSO usage
      // const getChecklistNameOnly = checklistRequest.buildUrl(
      //   createdChecklistId,
      //   'name',
      // );

      // Act: 'https://api.trello.com/1/checklists/{id}/{field}?key=APIKey&token=APIToken'
      // // RUSO usage
      // const response = await checklistRequest.sendRequest(
      //   'get',
      //   getChecklistNameOnly,
      //   {
      //     headers,
      //     params,
      //   },
      // );
      // ROP usage
      const response = await checklistRequest.getCheckListField(
        createdChecklistId,
        'name',
        params,
        headers,
      );

      const responseJSON = await response.json();
      const { _value: actualChecklistName } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualChecklistName).toContain(checklistDataForVerification);
    });
  });

  test('4. Delete checklist and verify success', async ({ request }) => {
    const checklistRequest = new ChecklistRequest(request);
    await test.step('4.1 Should delete a checklist', async () => {
      //Arrange:
      const expectedStatusCode = 200;
      const expectedResponseObject = {};
      // RUSO usage
      // const deleteChecklistUrl = checklistRequest.buildUrl(createdChecklistId);

      // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
      // // RUSO usage
      // const response = await checklistRequest.sendRequest(
      //   'delete',
      //   deleteChecklistUrl,
      //   {
      //     headers,
      //     params,
      //   },
      // );
      // RUSO usage
      const response = await checklistRequest.deleteCheckList(
        createdChecklistId,
        params,
        headers,
      );
      const responseJSON = await response.json();
      const { limits: actualChecklistObject } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualChecklistObject).toEqual(expectedResponseObject);
    });
    await test.step('4.2 (NP) Should NOT get deleted checklist', async () => {
      // Arrange:
      const expectedStatusCode = 404;
      const expectedStatusText = 'Not Found';
      // RUSO usage
      // const getDeletedChecklistUrl =
      //   checklistRequest.buildUrl(createdChecklistId);

      // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
      // // RUSO usage
      // const response = await checklistRequest.sendRequest(
      //   'delete',
      //   getDeletedChecklistUrl,
      //   {
      //     headers,
      //     params,
      //   },
      // );
      // ROP usage
      const response = await checklistRequest.deleteCheckList(
        createdChecklistId,
        params,
        headers,
      );

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toEqual(expectedStatusText);
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
