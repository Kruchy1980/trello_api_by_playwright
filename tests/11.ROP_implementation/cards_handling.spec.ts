import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { asRecord } from '@_src/API/helpers/conversion_helpers/convert_as_record';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { BoardRequest } from '@_src/API/requests/for_ROP_Requests/boardRequest';
import { CardRequest } from '@_src/API/requests/for_ROP_Requests/cardRequest';

import { headers, params } from '@_src/API/utils/api_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Improve to ROP (Request Object Pattern)

test.describe('Cards handling - ROP implemented', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  test.beforeAll(
    'Board preparation and lists collection',
    async ({ request }) => {
      // Arrange:
      const boardRequest = new BoardRequest(request);
      // RUSO Usage
      // const boardURL = boardRequest.buildUrl();
      const data: BoardDataModel = prepareRandomBoardDataSimplified();

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      // RUSO usage
      const response = await boardRequest.createBoard(data, params, headers);
      const responseJSON = await response.json();
      const { id: actualBoardId } = responseJSON;

      createdBoardId = actualBoardId;

      // Collecting lists
      // RUSO usage
      // const getListsUrl = boardRequest.buildUrl(createdBoardId, 'lists');

      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      // RUSO Usage
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
    },
  );
  test.beforeEach('Create a new card', async ({ request }) => {
    // Arrange:
    const cardRequest = new CardRequest(request);
    const expectedStatusCode = 200;
    // RUSO usage
    // const createCardUrl = cardRequest.buildUrl();

    const data: CardDataModel = prepareRandomCardDataSimplified(
      createdListsIds[0],
      'Name',
      '',
      undefined,
      '',
      true,
      -1,
    );
    const {
      name: expectedCardName,
      desc: expectedCardDescription,
      due: expectedCardDueDate,
    } = data;

    // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    // // RUSO usage
    // const response = await cardRequest.sendRequest('post', createCardUrl, {
    //   headers,
    //   params,
    //   data,
    // });
    // ROP usage
    const response = await cardRequest.createCard(data, params, headers);
    const responseJSON = await response.json();
    const {
      id: actualCardId,
      name: actualCardName,
      desc: actualCardDescription,
      due: actualCardDueDate,
    } = responseJSON;

    // Assert
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    expect(actualCardName).toContain(expectedCardName);
    expect(actualCardDescription).toContain(expectedCardDescription);
    expect(actualCardDueDate).toContain(expectedCardDueDate);

    createdCardId = actualCardId;
  });

  test('1. Update and get updated card', async ({ request }) => {
    const cardRequest = new CardRequest(request);
    const updatedCardValues: CardDataModel =
      await test.step('1.1 Should update a Card', async () => {
        // Arrange:
        const expectedStatusCode = 200;
        // RUSO usage
        // const updateCardUrl = cardRequest.buildUrl(createdCardId);

        const data: CardDataModel = prepareRandomCardDataSimplified(
          '',
          'Updated: ',
          undefined,
          undefined,
          '',
          true,
          3,
        );
        const { name: expectedCardName, due: expectedCardDueDate } = data;

        // Act: 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
        // // RUSO usage
        // const response = await cardRequest.sendRequest('put', updateCardUrl, {
        //   headers,
        //   params,
        //   data,
        // });
        // ROP usage
        const response = await cardRequest.updateCard(
          createdCardId,
          data,
          params,
          headers,
        );
        const responseJSON = await response.json();
        const {
          id: actualCardId,
          name: actualCardName,
          desc: actualCardDescription,
          due: actualCardDueDate,
        } = responseJSON;

        // Assert
        expect(response.status()).toEqual(expectedStatusCode);
        expect(actualCardId).toContain(createdCardId);
        expect(actualCardName).toContain(expectedCardName);
        expect(actualCardDueDate).toContain(expectedCardDueDate);

        data.desc = actualCardDescription;

        return data;
      });
    await test.step('1.2 Should get a Card fields', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      // RUSO usage
      // const getCardFieldsUrl = cardRequest.buildUrl(createdCardId);
      const {
        name: expectedCardName,
        desc: expectedCardDescription,
        due: expectedCardDueDate,
      } = updatedCardValues;

      const updatedCardParams: ParamsDataModel = prepareParamsDataSimplified(
        '',
        '',
        '',
        undefined,
        false,
        '',
        'name,desc,due',
      );

      // Act: ('https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      // // RUSO usage
      // const response = await cardRequest.sendRequest('get', getCardFieldsUrl, {
      //   headers,
      //   params: { ...params, ...updatedCardParams },
      // });
      // RUSO usage
      const response = await cardRequest.getCardElements(
        createdCardId,
        asRecord(updatedCardParams),
        headers,
      );
      const responseJSON = await response.json();
      const {
        id: actualCardId,
        name: actualCardName,
        desc: actualCardDescription,
        due: actualCardDueDate,
      } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualCardId).toContain(createdCardId);
      expect(actualCardName).toContain(expectedCardName);
      expect(actualCardDescription).toContain(expectedCardDescription);
      expect(actualCardDueDate).toContain(expectedCardDueDate);
    });
  });
  test('2. Delete and verify deleted card', async ({ request }) => {
    const cardRequest = new CardRequest(request);
    await test.step('2.1 Should delete a Card', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      // RUSO usage
      // const deleteCardUrl = cardRequest.buildUrl(createdCardId);
      const expectedResponseObject = {};

      // Act: 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      // // RUSO usage
      // const response = await cardRequest.sendRequest('delete', deleteCardUrl, {
      //   headers,
      //   params,
      // });
      // ROP usage
      const response = await cardRequest.deleteCard(
        createdCardId,
        params,
        headers,
      );
      const responseJSON = await response.json();
      const { limits: actualResponseObject } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualResponseObject).toEqual(expectedResponseObject);
    });
    await test.step('2.2 (NP) Should NOT get deleted card', async () => {
      // Arrange:
      const expectedStatusCode = 404;
      const expectedStatusText = 'Not Found';
      // RUSO usage
      // const getDeletedCardUrl = cardRequest.buildUrl(createdCardId);
      const deletedCardParams: ParamsDataModel = prepareParamsDataSimplified(
        '',
        '',
        '',
        undefined,
        false,
        '',
        'name,desc,due',
      );

      // Act: ('https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      // RUSO Usage
      const response = await cardRequest.getCardElements(
        createdCardId,
        asRecord(deletedCardParams),
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
    // RUSO usage
    await boardRequest.deleteBoard(createdBoardId, params, headers);
  });
});
