import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCommentDataSimplified } from '@_src/API/factories/simplified_factories/card_comments-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { CardCommentDataModel } from '@_src/API/models/card_comments-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { ActionRequest } from '@_src/API/requests/actionRequest';
import { BoardRequest } from '@_src/API/requests/boardRequest';
import { CardRequest } from '@_src/API/requests/cardRequest';
import { headers, params } from '@_src/API/utils/api_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Implement RUSO (Request Unit/Utility/ Service Object)
// TODO: Improve to ROP (Request Object Model)

test.describe('Cards comments handling - RU_SO implemented', () => {
  // Variables needed for tests
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  let commentActionId: string;
  // Added for verification
  let createdCommentText: string;

  test.beforeAll(
    'Board, card preparation and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const boardRequest = new BoardRequest(request);
      const data: BoardDataModel = prepareRandomBoardDataSimplified();
      // Path generator used only
      // const boardURL = generatePathURLSimplified(pathParameters.boardParameter);
      // RUSO usage
      const boardURL = boardRequest.buildUrl();

      // // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      // // Path generator usage only
      // const response = await request.post(boardURL, {
      //   headers,
      //   params,
      //   data,
      // });
      // RUSO Usage
      const response = await boardRequest.sendRequest('POST', boardURL, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      const { id: actualBoardId } = responseJSON;

      createdBoardId = actualBoardId;

      // Collect lists Id's
      // Arrange:
      // // Path generator used only
      // const getListsUrl = generatePathURLSimplified(
      //   pathParameters.boardParameter,
      //   createdBoardId,
      //   'lists',
      // );
      // RUSO usage - lists from board collection
      const getListsUrl = boardRequest.buildUrl(createdBoardId, 'lists');
      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      // // Path parameter generator used only
      // const responseListsIds = await request.get(getListsUrl, {
      //   headers,
      //   params,
      // });
      // RUSO usage
      const responseListsIds = await boardRequest.sendRequest(
        'get',
        getListsUrl,
        {
          headers,
          params,
        },
      );
      const responseListsIdsJSON = await responseListsIds.json();

      responseListsIdsJSON.forEach(({ id }: { id: string }) => {
        createdListsIds.push(id);
      });

      // Card Preparation
      // Arrange:
      const cardRequest = new CardRequest(request);
      // // Path params generator usage
      // const cardsUrl = generatePathURLSimplified(pathParameters.cardParameter);
      // Path params generator usage
      const cardsUrl = cardRequest.buildUrl();
      // // Factory usage
      const cardCreationData: CardDataModel = prepareRandomCardDataSimplified(
        createdListsIds[0],
        '',
        undefined,
        undefined,
        undefined,
        true,
      );

      // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      // // Path params generator used only
      // const responseCardCreation = await request.post(cardsUrl, {
      //   headers,
      //   params,
      //   data: { ...cardCreationData },
      // });
      // RUSO usage
      const responseCardCreation = await cardRequest.sendRequest(
        'post',
        cardsUrl,
        {
          headers,
          params,
          data: cardCreationData,
        },
      );
      const responseCardCreationJSON = await responseCardCreation.json();
      const { id: actualCardId } = responseCardCreationJSON;
      createdCardId = actualCardId;
    },
  );
  test.beforeEach('Create a new comment on a card', async ({ request }) => {
    // Arrange:
    const cardRequest = new CardRequest(request);
    const expectedStatusCode = 200;
    const expectedCommentType = 'comment';
    // Path generator usage
    // const createCommentUrl = generatePathURLSimplified(
    //   pathParameters.cardParameter,
    //   createdCardId,
    //   'actions',
    //   'comments',
    // );
    // RUSO Usage
    const createCommentUrl = cardRequest.buildUrl(
      createdCardId,
      'actions',
      'comments',
    );

    const data: CardCommentDataModel = prepareRandomCommentDataSimplified(
      '',
      2,
    );
    const { text: expectedCardCommentText } = data;

    // Act: 'https://api.trello.com/1/cards/{id}/actions/comments?text={text}&key=APIKey&token=APIToken'
    // // Path generator usage
    // const response = await request.post(createCommentUrl, {
    //   headers,
    //   params,
    //   data,
    // });
    // RUSO usage
    const response = await cardRequest.sendRequest('post', createCommentUrl, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    const { id: actualCommentActionId, entities } = responseJSON;
    const { type: actualCardCommentType, text: actualCardCommentText } =
      entities[entities.length - 1];

    //Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON.entities[0]).toHaveProperty('id');
    expect(actualCardCommentType).toContain(expectedCommentType);
    expect(actualCardCommentText).toContain(expectedCardCommentText);

    commentActionId = actualCommentActionId;
    createdCommentText = expectedCardCommentText;
  });

  test('1. Should get a comment on a card', async ({ request }) => {
    // Arrange:
    const cardRequest = new CardRequest(request);
    const expectedStatusCode = 200;
    const expectedCardCommentText = createdCommentText;
    // // Path generator used only
    // const getCommentUrl = generatePathURLSimplified(
    //   pathParameters.cardParameter,
    //   createdCardId,
    //   'actions',
    // );
    // RUSO usage
    const getCommentUrl = cardRequest.buildUrl(createdCardId, 'actions');

    const commentCardParams: ParamsDataModel = prepareParamsDataSimplified(
      '',
      '',
      '',
      undefined,
      false,
      'commentCard',
    );

    // Act: 'https://api.trello.com/1/cards/{id}/actions?key=APIKey&token=APIToken'
    // // Path params generator used only
    // const response = await request.get(getCommentUrl, {
    //   headers,
    //   params: { ...params, ...commentCardParams },
    // });
    // RUSO usage
    const response = await cardRequest.sendRequest('get', getCommentUrl, {
      headers,
      params: { ...params, ...commentCardParams },
    });
    const responseJSON = await response.json();
    const [currentCommentObject] = responseJSON;
    const {
      data: { text: actualCardCommentText },
    } = currentCommentObject;

    //Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(actualCardCommentText).toContain(expectedCardCommentText);
  });
  test('2. Should update a comment action on a card', async ({ request }) => {
    // Arrange:
    const cardRequest = new CardRequest(request);
    const expectedStatusCode = 200;
    // // Path generator usage only
    // const updateCommentUrl = generatePathURLSimplified(
    //   pathParameters.cardParameter,
    //   createdCardId,
    //   'actions',
    //   commentActionId,
    //   'comments',
    // );
    // RUSO usage
    const updateCommentUrl = cardRequest.buildUrl(
      createdCardId,
      'actions',
      commentActionId,
      'comments',
    );
    const data: CardCommentDataModel = prepareRandomCommentDataSimplified(
      'Updated ',
      3,
    );
    const { text: expectedCardCommentText } = data;
    // Act: 'https://api.trello.com/1/cards/{id}/actions/{idAction}/comments?text={text}&key=APIKey&token=APIToken'
    // // Path generator usage
    // const response = await request.put(updateCommentUrl, {
    //   headers,
    //   params,
    //   data,
    // });
    // RUSO usage
    const response = await cardRequest.sendRequest('put', updateCommentUrl, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    const {
      id: actualCardCommentId,
      data: { text: actualCardCommentText },
    } = responseJSON;

    //Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(actualCardCommentId).toContain(commentActionId);
    expect(actualCardCommentText).toContain(expectedCardCommentText);
  });

  test('3. Delete comment action and verify whether source exists', async ({
    request,
  }) => {
    const cardRequest = new CardRequest(request);
    await test.step('3.1 Should Delete a comment action on a card', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const expectedResponseValue = null;
      // // Path generator usage
      // const deleteCommentURL = generatePathURLSimplified(
      //   pathParameters.cardParameter,
      //   createdCardId,
      //   'actions',
      //   commentActionId,
      //   'comments',
      // );
      // RUSO usage
      const deleteCommentURL = cardRequest.buildUrl(
        createdCardId,
        'actions',
        commentActionId,
        'comments',
      );
      // Act: 'https://api.trello.com/1/cards/{id}/actions/{idAction}/comments?key=APIKey&token=APIToken'
      const response = await request.delete(deleteCommentURL, {
        headers,
        params,
      });
      const responseJSON = await response.json();
      const { _value: actualResponseValue } = responseJSON;

      //Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualResponseValue).toEqual(expectedResponseValue);
    });
    await test.step('3.2 (NP) Should Not Get deleted comment Action', async () => {
      // Arrange:
      const actionRequest = new ActionRequest(request);
      const expectedStatusCode = 404;
      const expectedResponseText = 'Not Found';
      // // Path params generator usage
      // const getDeletedCommentURL = generatePathURLSimplified(
      //   pathParameters.actionsParameter,
      //   commentActionId,
      // );
      // RUSO usage
      const getDeletedCommentURL = actionRequest.buildUrl(commentActionId);

      // Act: 'https://api.trello.com/1/actions/{id}?key=APIKey&token=APIToken'
      // // Path params generator usage
      // const response = await request.get(getDeletedCommentURL, {
      //   headers,
      //   params,
      // });
      // RUSO usage
      const response = await actionRequest.sendRequest(
        'get',
        getDeletedCommentURL,
        {
          headers,
          params,
        },
      );

      //Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toEqual(expectedResponseText);
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
