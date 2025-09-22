import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCommentDataSimplified } from '@_src/API/factories/simplified_factories/card_comments-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { CardCommentDataModel } from '@_src/API/models/card_comments-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Cards comments handling - destructured', () => {
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

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      const response = await request.post(`/1/boards`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);
      // Destructuring responseJSON object
      const { id: expectedBoardId } = responseJSON;
      // === Value to variable Assigning ===
      // Before destructuring
      // createdBoardId = responseJSON.id;
      // After destructuring
      createdBoardId = expectedBoardId;

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
      // responseListsIdsJSON.forEach((listId: { id: string }) => {
      //   createdListsIds.push(listId.id);
      // Destructuring responseListsIdsJSON object inside loop
      responseListsIdsJSON.forEach(({ id }: { id: string }) => {
        createdListsIds.push(id);
      });

      // Card Preparation
      // Arrange:
      const cardCreationData: CardDataModel = prepareRandomCardDataSimplified(
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
      // Destructuring responseJSON
      const { id: expectedCardId } = responseCardCreationJSON;
      // === Value to variable Assigning ===
      // Before Destructuring
      // createdCardId = responseCardCreationJSON.id;
      // After Destructuring
      createdCardId = expectedCardId;
    },
  );
  test.beforeEach('Create a new comment on a card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedCommentType = 'comment';

    const data: CardCommentDataModel = prepareRandomCommentDataSimplified(
      '',
      2,
    );
    // console.log('New Card data:', data);
    const { text: expectedCardCommentText } = data;

    // Act: 'https://api.trello.com/1/cards/{id}/actions/comments?text={text}&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/cards/${createdCardId}/actions/comments`,
      { headers, params, data },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // console.log(responseJSON.entities);
    // console.log('Create new comment entity:', responseJSON);
    // console.log('Entities in response:', responseJSON.entities);
    // Destructuring responseJSON object
    // 2 Steps Destructuring
    // Step 1 - destructuring 2 different properties in one  step
    const { id: actualCommentActionId, entities } = responseJSON;
    // Step 2 Retrieving proper data from entities
    const { type: actualCardCommentType, text: actualCardCommentText } =
      entities[entities.length - 1];
    //       // Step 1 + 2 destructuring - for easier code reading - not recommended by Me in the test
    // const { id: actualCommentActionId, entities } = responseJSON,
    //   { type: actualCardCommentType, text: actualCardCommentText } =
    //     entities[entities.length - 1];

    //Assert:
    // // Before Destructuring
    // expect(response.status()).toEqual(expectedStatusCode);
    // expect(responseJSON.entities[0]).toHaveProperty('id');
    // const actualCardCommentType =
    //   responseJSON.entities[responseJSON.entities.length - 1].type;
    // expect(actualCardCommentType).toContain(expectedCommentType);
    // const actualCardCommentText =
    //   responseJSON.entities[responseJSON.entities.length - 1].text;
    // expect(actualCardCommentText).toContain(data.text);
    // // === Add text of comment to global/script variable ===
    // commentActionId = responseJSON.id;
    // createdCommentText = data.text;

    // After Destructuring
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON.entities[0]).toHaveProperty('id');
    // const actualCardCommentType =
    //   responseJSON.entities[responseJSON.entities.length - 1].type;
    expect(actualCardCommentType).toContain(expectedCommentType);
    // const actualCardCommentText =
    //   responseJSON.entities[responseJSON.entities.length - 1].text;
    expect(actualCardCommentText).toContain(expectedCardCommentText);
    // === Add text of comment and action Id to global/script variable ===
    commentActionId = actualCommentActionId;
    createdCommentText = expectedCardCommentText;
  });

  test('1. Should get a comment on a card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedCardCommentText = createdCommentText;

    const commentCardParams: ParamsDataModel = prepareParamsDataSimplified(
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
    const [currentCommentObject] = responseJSON;
    // console.log(currentCommentObject);
    // Step 2 retrieving proper data from object
    const {
      data: { text: actualCardCommentText },
    } = currentCommentObject;
    // console.log(actualCardCommentText);

    //Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    // const actualCardCommentText = responseJSON[0].data.text;
    expect(actualCardCommentText).toContain(expectedCardCommentText);
  });
  test('2. Should update a comment action on a card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const data: CardCommentDataModel = prepareRandomCommentDataSimplified(
      'Updated ',
      3,
    );
    // console.log('Updated text of comment', data);
    // Destructuring data object
    const { text: expectedCardCommentText } = data;
    // Act: 'https://api.trello.com/1/cards/{id}/actions/{idAction}/comments?text={text}&key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/cards/${createdCardId}/actions/${commentActionId}/comments`,
      { headers, params, data },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // Destructuring responseJSON Object
    const {
      id: actualCardCommentId,
      data: { text: actualCardCommentText },
    } = responseJSON;

    //Assert:
    // // Before destructuring
    // expect(response.status()).toEqual(expectedStatusCode);
    // const actualCardCommentId = responseJSON.id;
    // expect(actualCardCommentId).toContain(commentActionId);
    // const actualCardCommentText = responseJSON.data.text;
    // expect(actualCardCommentText).toContain(data.text);
    // After destructuring
    expect(response.status()).toEqual(expectedStatusCode);
    // const actualCardCommentId = responseJSON.id;
    expect(actualCardCommentId).toContain(commentActionId);
    // const actualCardCommentText = responseJSON.data.text;
    expect(actualCardCommentText).toContain(expectedCardCommentText);
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
      // Destructuring responseJSON object
      const { _value: actualResponseValue } = responseJSON;

      //Assert:
      // // Before destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualResponseValue = responseJSON._value;
      // expect(actualResponseValue).toEqual(expectedResponseValue);
      // After destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualResponseValue = responseJSON._value;
      expect(actualResponseValue).toEqual(expectedResponseValue);
    });
    await test.step('3.2 (NP) Should Not Get deleted comment Action', async () => {
      // Arrange: !!! No destructuring needed
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
