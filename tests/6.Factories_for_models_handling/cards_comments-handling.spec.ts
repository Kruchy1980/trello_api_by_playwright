import { prepareRandomBoardData } from '@_src/API/factories/board-data.factory';
import { prepareRandomCommentData } from '@_src/API/factories/card_comments-data.factory';
import { prepareRandomCardData } from '@_src/API/factories/cards-data.factory';
import { prepareParamsData } from '@_src/API/factories/params-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { CardCommentDataModel } from '@_src/API/models/card_comments-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Prepare factories for models handling
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Cards comments handling - factories implementation', () => {
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
      // const data: BoardDataModel = {
      //   name: `My Board - ${new Date().toISOString().split('T')[1].split('Z')[0]}`,
      // };
      const data: BoardDataModel = prepareRandomBoardData();

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
      // const cardCreationData: CardDataModel = {
      //   idList: createdListsIds[0],
      //   name: 'My first card for comments name',
      //   due: new Date(
      //     new Date().setDate(new Date().getDate() + 2),
      //   ).toISOString(),
      // };
      const cardCreationData: CardDataModel = prepareRandomCardData(
        createdListsIds[0],
        '',
        undefined,
        undefined,
        undefined,
        true,
      );

      // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      const responseCardCreation = await request.post(`/1/cards`, {
        headers,
        params,
        data: cardCreationData,
      });
      const responseCardCreationJSON = await responseCardCreation.json();
      // console.log(responseJSON);
      createdCardId = responseCardCreationJSON.id;
    },
  );
  test.beforeEach('Create a new comment on a card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedCommentType = 'comment';
    // const data: CardCommentDataModel = {
    //   text: 'My first comment on a card',
    // };
    const data: CardCommentDataModel = prepareRandomCommentData('', 2);

    // Act: 'https://api.trello.com/1/cards/{id}/actions/comments?text={text}&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/cards/${createdCardId}/actions/comments`,
      { headers, params, data },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // console.log(responseJSON.entities);
    commentActionId = responseJSON.id;

    //Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON.entities[0]).toHaveProperty('id');
    const actualCardCommentType =
      responseJSON.entities[responseJSON.entities.length - 1].type;
    expect(actualCardCommentType).toContain(expectedCommentType);
    const actualCardCommentText =
      responseJSON.entities[responseJSON.entities.length - 1].text;
    expect(actualCardCommentText).toContain(data.text);
    // Add text of comment to global variable
    createdCommentText = data.text;
  });

  test('1. Should get a comment on a card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedCardCommentText = createdCommentText;

    // const commentCardParams: ParamsDataModel = {
    //   key: params.key,
    //   token: params.token,
    //   filter: 'commentCard',
    // };
    const commentCardParams: ParamsDataModel = prepareParamsData(
      '',
      '',
      '',
      undefined,
      false,
      'commentCard',
    );
    // console.log(commentCardParams);

    // Act: 'https://api.trello.com/1/cards/{id}/actions?key=APIKey&token=APIToken'
    const response = await request.get(`/1/cards/${createdCardId}/actions`, {
      headers,
      params: { ...params, ...commentCardParams },
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // commentActionId = responseJSON[0].id;

    //Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualCardCommentText = responseJSON[0].data.text;
    expect(actualCardCommentText).toContain(expectedCardCommentText);
  });
  test('2. Should update a comment action on a card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    // const data: CardCommentDataModel = {
    //   text: 'Updated comment text',
    // };
    const data: CardCommentDataModel = prepareRandomCommentData('Updated ', 3);
    // Act: 'https://api.trello.com/1/cards/{id}/actions/{idAction}/comments?text={text}&key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/cards/${createdCardId}/actions/${commentActionId}/comments`,
      { headers, params, data },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    //Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualCardCommentId = responseJSON.id;
    expect(actualCardCommentId).toContain(commentActionId);
    const actualCardCommentText = responseJSON.data.text;
    expect(actualCardCommentText).toContain(data.text);
  });

  test('3. Delete comment action and verify whether source exists', async ({
    request,
  }) => {
    await test.step('3.1 Should Delete a comment action on a card', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const expectedResponseValue = null;
      // Act: 'https://api.trello.com/1/cards/{id}/actions/{idAction}/comments?key=APIKey&token=APIToken'
      const response = await request.delete(
        `/1/cards/${createdCardId}/actions/${commentActionId}/comments`,
        { headers, params },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);

      //Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualResponseValue = responseJSON._value;
      expect(actualResponseValue).toEqual(expectedResponseValue);
    });
    await test.step('3.2 (NP) Should Not Get deleted comment Action', async () => {
      // Arrange:
      const expectedStatusCode = 404;
      const expectedResponseText = 'Not Found';

      // Act: 'https://api.trello.com/1/actions/{id}?key=APIKey&token=APIToken'
      const response = await request.get(`/1/actions/${commentActionId}`, {
        headers,
        params,
      });

      //Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toEqual(expectedResponseText);
    });
  });
  test.afterAll('Delete a board', async ({ request }) => {
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
  });
});
