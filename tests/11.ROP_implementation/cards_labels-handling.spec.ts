import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import {
  prepareOperationDataSimplified,
  prepareRandomLabelDataSimplified,
} from '@_src/API/factories/simplified_factories/cards_labels-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import {
  LabelDataModelSimplified,
  LabelOperationsDataModelSimplified,
} from '@_src/API/models/card_label_new_version_model/card_label_model_simplified';
import { BoardRequest } from '@_src/API/requests/for_ROP_Requests/boardRequest';
import { CardRequest } from '@_src/API/requests/for_ROP_Requests/cardRequest';
import { LabelRequest } from '@_src/API/requests/for_ROP_Requests/labelRequest';

import { headers, params } from '@_src/API/utils/api_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Improve to ROP (Request Object Pattern)

test.describe('Cards labels handling - RU_SO implemented', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  const createdCardsIds: string[] = [];
  let createdBoardLabelId: string;

  test.beforeAll(
    'Board, card preparation and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const boardRequest = new BoardRequest(request);
      // RUSO Usage
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
      // Arrange:
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
      // RUSO usage
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
      const cardRequest = new CardRequest(request);
      for (let i = 0; i < 2; i++) {
        // RUSO usage
        // const cardCreationUrl = cardRequest.buildUrl();
        const dataCardCreation: CardDataModel = prepareRandomCardDataSimplified(
          createdListsIds[i],
          'My Card Name',
          undefined,
          undefined,
          undefined,
          true,
          i + 1,
        );

        // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
        // // RUSO Usage
        // const response = await cardRequest.sendRequest(
        //   'post',
        //   cardCreationUrl,
        //   {
        //     headers,
        //     params,
        //     data: dataCardCreation,
        //   },
        // );
        // ROP Usage
        const response = await cardRequest.createCard(
          dataCardCreation,
          params,
          headers,
        );
        const responseJSON = await response.json();
        const { id: actualCardId } = responseJSON;
        createdCardsIds.push(actualCardId);
      }
    },
  );

  test.beforeEach('Create a new label', async ({ request }) => {
    // Arrange:
    const labelRequest = new LabelRequest(request);
    const expectedStatusCode = 200;
    // RUSO Usage
    // const createLabelURL = labelRequest.buildUrl();
    const data: LabelDataModelSimplified = prepareRandomLabelDataSimplified(
      'red',
      'Do it ASAP',
      undefined,
      createdBoardId,
    );
    const { color: expectedBoardLabelColor, name: expectedBoardLabeName } =
      data;

    // Act: 'https://api.trello.com/1/labels?name={name}&color={color}&idBoard={idBoard}&key=APIKey&token=APIToken'
    // // RUSO usage
    // const response = await labelRequest.sendRequest('post', createLabelURL, {
    //   headers,
    //   params,
    //   data,
    // });
    // RUSO usage
    const response = await labelRequest.createLabel(data, params, headers);
    const responseJSON = await response.json();
    const {
      id: actualBoardLabelId,
      name: actualBoardLabelName,
      color: actualBoardLabelColor,
    } = responseJSON;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    expect(actualBoardLabelName).toContain(expectedBoardLabeName);
    expect(actualBoardLabelColor).toContain(expectedBoardLabelColor);

    createdBoardLabelId = actualBoardLabelId;
  });
  test('1. Should add label to card', async ({ request }) => {
    // Arrange:
    const cardRequest = new CardRequest(request);
    const expectedStatusCode = 200;
    const cardId = createdCardsIds[0];
    // RUSO usage
    // const addLabelToCardUrl = cardRequest.buildUrl(cardId, 'idLabels');
    const data: LabelOperationsDataModelSimplified =
      prepareOperationDataSimplified(createdBoardLabelId);
    const { value: expectedBoardLabelId } = data;

    // Act: 'https://api.trello.com/1/cards/{id}/idLabels?key=APIKey&token=APIToken'
    // // RUSO usage
    // const response = await cardRequest.sendRequest('post', addLabelToCardUrl, {
    //   headers,
    //   params,
    //   data,
    // });
    // RUSO usage
    const response = await cardRequest.addLabelToCard(
      cardId,
      'idLabels',
      data,
      params,
      headers,
    );
    const responseJSON = await response.json();
    const [actualLabelId] = responseJSON;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(actualLabelId).toContain(expectedBoardLabelId);
  });

  test('2. Should update whole label', async ({ request }) => {
    // Arrange:
    const labelRequest = new LabelRequest(request);
    const expectedStatusCode = 200;
    // RUSO Usage
    // const updateWholeLabelUrl = labelRequest.buildUrl(createdBoardLabelId);
    const data: LabelDataModelSimplified = prepareRandomLabelDataSimplified(
      'black',
      'Custom label for a card - updated for deadly',
      3,
    );
    const { color: expectedBoardLabelColor, name: expectedBoardLabelName } =
      data;

    // Act: 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken'
    // // RUSO usage
    // const response = await labelRequest.sendRequest(
    //   'put',
    //   updateWholeLabelUrl,
    //   {
    //     headers,
    //     params,
    //     data,
    //   },
    // );
    // ROP usage
    const response = await labelRequest.updateLabel(
      createdBoardLabelId,
      data,
      params,
      headers,
    );
    const responseJSON = await response.json();
    const {
      id: actualBoardLabelId,
      name: actualBoardLabelName,
      color: actualBoardLabelColor,
    } = responseJSON;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    expect(actualBoardLabelId).toContain(createdBoardLabelId);
    expect(actualBoardLabelName).toContain(expectedBoardLabelName);
    expect(actualBoardLabelColor).toContain(expectedBoardLabelColor);
  });

  test.describe('Cards Labels handling - directly on Card - independent', () => {
    let createdLabelOnCardId: string;
    test.beforeEach('Create label directly on card', async ({ request }) => {
      // Arrange:
      const cardRequest = new CardRequest(request);
      const expectedStatusCode = 200;
      const cardId = createdCardsIds[1];
      // RUSO usage
      // const createLabelOnCardPath = cardRequest.buildUrl(cardId, 'labels');
      const data: LabelDataModelSimplified = prepareRandomLabelDataSimplified(
        'yellow',
        '',
        2,
      );
      const { color: expectedBoardLabelColor, name: expectedBoardLabelName } =
        data;

      // Act: 'https://api.trello.com/1/cards/{id}/labels?color={color}&key=APIKey&token=APIToken'
      // // RUSO usage
      // const response = await cardRequest.sendRequest(
      //   'post',
      //   createLabelOnCardPath,
      //   {
      //     headers,
      //     params,
      //     data,
      //   },
      // );
      // RUSO usage
      const response = await cardRequest.createLabelOnCard(
        cardId,
        'labels',
        data,
        params,
        headers,
      );
      const responseJSON = await response.json();
      const {
        id: actualLabelId,
        name: actualLabelName,
        color: actualLabelColor,
      } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(responseJSON).toHaveProperty('id');
      expect(actualLabelName).toContain(expectedBoardLabelName);
      expect(actualLabelColor).toContain(expectedBoardLabelColor);

      createdLabelOnCardId = actualLabelId;
    });
    test('3. Should update field on label', async ({ request }) => {
      // Arrange:
      const labelRequest = new LabelRequest(request);
      const expectedStatusCode = 200;
      // RUSO usage
      // const updateLabelFieldUrl = labelRequest.buildUrl(createdLabelOnCardId);
      const data: LabelDataModelSimplified = prepareRandomLabelDataSimplified();
      const { color: expectedLabelColor } = data;

      // Act: 'https://api.trello.com/1/labels/{id}/{field}?value=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      // // RUSO usage
      // const response = await labelRequest.sendRequest(
      //   'put',
      //   updateLabelFieldUrl,
      //   {
      //     headers,
      //     params,
      //     data,
      //   },
      // );
      // RUSO usage
      const response = await labelRequest.updateLabel(
        createdLabelOnCardId,
        data,
        params,
        headers,
      );
      const responseJSON = await response.json();
      const { id: actualLabelId, color: actualLabelColor } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualLabelId).toContain(createdLabelOnCardId);
      expect(actualLabelColor).toContain(expectedLabelColor);
    });
    test('4. Should delete label and verify whether resource exists', async ({
      request,
    }) => {
      const labelRequest = new LabelRequest(request);
      await test.step('4.1 Should delete a label', async () => {
        // Arrange:
        const expectedStatusCode = 200;
        const expectedResponseObject = {};
        // RUSO Usage
        // const deleteLabelUrl = labelRequest.buildUrl(createdLabelOnCardId);

        // Act: 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken'
        // // RUSO usage
        // const response = await labelRequest.sendRequest(
        //   'delete',
        //   deleteLabelUrl,
        //   {
        //     headers,
        //     params,
        //   },
        // );
        // RUSO usage
        const response = await labelRequest.deleteLabel(
          createdLabelOnCardId,
          params,
          headers,
        );
        const responseJSON = await response.json();
        const { limits: actualResponseObject } = responseJSON;

        // Assert:
        expect(response.status()).toEqual(expectedStatusCode);
        expect(actualResponseObject).toEqual(expectedResponseObject);
      });
      await test.step('4.2 (NP) Should NOT get deleted label', async () => {
        // Arrange:
        const expectedStatusCode = 404;
        const expectedResponseStatusText = 'Not Found';
        // RUSO Usage
        // const getDeletedLabelUrl = labelRequest.buildUrl(createdLabelOnCardId);

        // Act: 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken'
        // // RUSO Usage
        // const response = await labelRequest.sendRequest(
        //   'get',
        //   getDeletedLabelUrl,
        //   {
        //     headers,
        //     params,
        //   },
        // );
        // RUSO Usage
        const response = await labelRequest.getLabel(
          createdLabelOnCardId,
          params,
          headers,
        );

        // Assert:
        expect(response.status()).toEqual(expectedStatusCode);
        expect(response.statusText()).toContain(expectedResponseStatusText);
      });
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
