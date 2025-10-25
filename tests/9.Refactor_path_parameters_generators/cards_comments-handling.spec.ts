import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCommentDataSimplified } from '@_src/API/factories/simplified_factories/card_comments-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { generatePathURLSimplified } from '@_src/API/helpers/path_params_generators/path_params_simplified_generator/simplified_path_parameters_generator';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { CardCommentDataModel } from '@_src/API/models/card_comments-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { pathParameters } from '@_src/API/utils/path_parameters_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Cards comments handling - path_generators', () => {
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
      const data: BoardDataModel = prepareRandomBoardDataSimplified();
      const boardURL = generatePathURLSimplified(pathParameters.boardParameter);

      // // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
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
      const responseListsIds = await request.get(getListsUrl, {
        headers,
        params,
      });
      const responseListsIdsJSON = await responseListsIds.json();

      responseListsIdsJSON.forEach(({ id }: { id: string }) => {
        createdListsIds.push(id);
      });

      // Card Preparation
      // Arrange:
      const cardsUrl = generatePathURLSimplified(pathParameters.cardParameter);
      const cardCreationData: CardDataModel = prepareRandomCardDataSimplified(
        createdListsIds[0],
        '',
        undefined,
        undefined,
        undefined,
        true,
      );

      // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      // const responseCardCreation = await request.post(`/1/cards`, {
      //   headers,
      //   params,
      //   data: cardCreationData,
      // });
      const responseCardCreation = await request.post(cardsUrl, {
        headers,
        params,
        data: cardCreationData,
      });
      const responseCardCreationJSON = await responseCardCreation.json();
      const { id: actualCardId } = responseCardCreationJSON;
      createdCardId = actualCardId;
    },
  );
  test.beforeEach('Create a new comment on a card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedCommentType = 'comment';
    const createCommentUrl = generatePathURLSimplified(
      pathParameters.cardParameter,
      createdCardId,
      'actions',
      'comments',
    );
    // console.log('commentURL:', createCommentUrl);

    const data: CardCommentDataModel = prepareRandomCommentDataSimplified(
      '',
      2,
    );
    const { text: expectedCardCommentText } = data;

    // Act: 'https://api.trello.com/1/cards/{id}/actions/comments?text={text}&key=APIKey&token=APIToken'
    // const response = await request.post(
    //   `/1/cards/${createdCardId}/actions/comments`,
    //   { headers, params, data },
    // );
    const response = await request.post(createCommentUrl, {
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
    const expectedStatusCode = 200;
    const expectedCardCommentText = createdCommentText;
    const getCommentUrl = generatePathURLSimplified(
      pathParameters.cardParameter,
      createdCardId,
      'actions',
    );

    const commentCardParams: ParamsDataModel = prepareParamsDataSimplified(
      '',
      '',
      '',
      undefined,
      false,
      'commentCard',
    );

    // Act: 'https://api.trello.com/1/cards/{id}/actions?key=APIKey&token=APIToken'
    // const response = await request.get(`/1/cards/${createdCardId}/actions`, {
    //   headers,
    //   params: { ...params, ...commentCardParams },
    // });
    const response = await request.get(getCommentUrl, {
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
    const expectedStatusCode = 200;
    const updateCommentUrl = generatePathURLSimplified(
      pathParameters.cardParameter,
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
    // const response = await request.put(
    //   `/1/cards/${createdCardId}/actions/${commentActionId}/comments`,
    //   { headers, params, data },
    // );
    const response = await request.put(updateCommentUrl, {
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
    await test.step('3.1 Should Delete a comment action on a card', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const expectedResponseValue = null;
      const deleteCommentURL = generatePathURLSimplified(
        pathParameters.cardParameter,
        createdCardId,
        'actions',
        commentActionId,
        'comments',
      );
      // Act: 'https://api.trello.com/1/cards/{id}/actions/{idAction}/comments?key=APIKey&token=APIToken'
      // const response = await request.delete(
      //   `/1/cards/${createdCardId}/actions/${commentActionId}/comments`,
      //   { headers, params },
      // );
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
      const expectedStatusCode = 404;
      const expectedResponseText = 'Not Found';
      const getDeletedCommentURL = generatePathURLSimplified(
        pathParameters.actionsParameter,
        commentActionId,
      );

      // Act: 'https://api.trello.com/1/actions/{id}?key=APIKey&token=APIToken'
      // const response = await request.get(`/1/actions/${commentActionId}`, {
      //   headers,
      //   params,
      // });
      const response = await request.get(getDeletedCommentURL, {
        headers,
        params,
      });

      //Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toEqual(expectedResponseText);
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
