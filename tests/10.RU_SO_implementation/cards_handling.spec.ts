import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { BoardRequest } from '@_src/API/requests/boardRequest';
import { CardRequest } from '@_src/API/requests/cardRequest';
import { headers, params } from '@_src/API/utils/api_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Implement RUSO (Request Unit/Utility/ Service Objects)
// TODO: Improve to ROP (Request Object Model)

test.describe('Cards handling - RUSO implemented', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  test.beforeAll(
    'Board preparation and lists collection',
    async ({ request }) => {
      // Arrange:
      const boardRequest = new BoardRequest(request);
      // Path params generator usage
      // const boardURL = generatePathURLSimplified(pathParameters.boardParameter);
      // Path params generator usage
      const boardURL = boardRequest.buildUrl();
      const data: BoardDataModel = prepareRandomBoardDataSimplified();

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      // // Path params generator usage
      // const response = await request.post(boardURL, {
      //   headers,
      //   params,
      //   data,
      // });
      // RUSO usage
      const response = await boardRequest.sendRequest('post', boardURL, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      const { id: actualBoardId } = responseJSON;

      createdBoardId = actualBoardId;

      // Collecting lists
      // Arrange:
      // // Path params generator usage
      // const getListsUrl = generatePathURLSimplified(
      //   pathParameters.boardParameter,
      //   createdBoardId,
      //   'lists',
      // );
      // RUSO usage
      const getListsUrl = boardRequest.buildUrl(createdBoardId, 'lists');

      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      // // Path generator usage
      // const responseGetLists = await request.get(getListsUrl, {
      //   headers,
      //   params,
      // });
      // Path generator usage
      const responseGetLists = await boardRequest.sendRequest(
        'get',
        getListsUrl,
        {
          headers,
          params,
        },
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
    // // Path params generator usage
    // const createCardUrl = generatePathURLSimplified(
    //   pathParameters.cardParameter,
    // );
    // RUSO usage
    const createCardUrl = cardRequest.buildUrl();

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
    // // Path params generator usage
    // const response = await request.post(createCardUrl, {
    //   headers,
    //   params,
    //   data,
    // });
    // RUSO usage
    const response = await cardRequest.sendRequest('post', createCardUrl, {
      headers,
      params,
      data,
    });
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
        // // Path parameter generator usage
        // const updateCardUrl = generatePathURLSimplified(
        //   pathParameters.cardParameter,
        //   createdCardId,
        // );
        // RUSO usage
        const updateCardUrl = cardRequest.buildUrl(createdCardId);

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
        // // Path params generator usage
        // const response = await request.put(updateCardUrl, {
        //   headers,
        //   params,
        //   data,
        // });
        // RUSO usage
        const response = await cardRequest.sendRequest('put', updateCardUrl, {
          headers,
          params,
          data,
        });
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
      // // Path params generator usage
      // const getCardFieldsUrl = generatePathURLSimplified(
      //   pathParameters.cardParameter,
      //   createdCardId,
      // );
      // RUSO usage
      const getCardFieldsUrl = cardRequest.buildUrl(createdCardId);
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
      // // Path parameters generator usage
      // const response = await request.get(getCardFieldsUrl, {
      //   headers,
      //   params: { ...params, ...updatedCardParams },
      // });
      // RUSO usage
      const response = await cardRequest.sendRequest('get', getCardFieldsUrl, {
        headers,
        params: { ...params, ...updatedCardParams },
      });
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
      // // Path parameter generator usage
      // const deleteCardUrl = generatePathURLSimplified(
      //   pathParameters.cardParameter,
      //   createdCardId,
      // );
      // RUSO usage
      const deleteCardUrl = cardRequest.buildUrl(createdCardId);
      const expectedResponseObject = {};
      // Act: 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      // // Path parameter generator usage
      // const response = await request.delete(deleteCardUrl, {
      //   headers,
      //   params,
      // });
      // RUSO usage
      const response = await cardRequest.sendRequest('delete', deleteCardUrl, {
        headers,
        params,
      });
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
      // // Path params generator usage
      // const getDeletedCardUrl = generatePathURLSimplified(
      //   pathParameters.cardParameter,
      //   createdCardId,
      // );
      // RUSO usage
      const getDeletedCardUrl = cardRequest.buildUrl(createdCardId);
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
      // // Path params generator usage
      // const response = await request.get(getDeletedCardUrl, {
      //   headers,
      //   params: { ...params, ...deletedCardParams },
      // });
      // Path params generator usage
      const response = await cardRequest.sendRequest('get', getDeletedCardUrl, {
        headers,
        params: { ...params, ...deletedCardParams },
      });

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toContain(expectedStatusText);
    });
  });
  test.afterAll('Delete a board', async ({ request }) => {
    // Arrange:
    const boardRequest = new BoardRequest(request);
    // Path parameters usage only
    // const deleteBoardUrl = generatePathURLSimplified(
    //   pathParameters.boardParameter,
    //   createdBoardId,
    // );
    // RUSO usage
    const deleteBoardUrl = boardRequest.buildUrl(createdBoardId);
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    // // Path Params usage only
    // await request.delete(deleteBoardUrl, {
    //   headers,
    //   params,
    // });
    // RUSO usage
    await boardRequest.sendRequest('delete', deleteBoardUrl, {
      headers,
      params,
    });
  });
});
