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

import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Cards labels handling - simplified factories', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  const createdCardsIds: string[] = [];
  let createdBoardLabelId: string;

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
      for (let i = 0; i < 2; i++) {
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
        const response = await request.post(`/1/cards`, {
          headers,
          params,
          data: dataCardCreation,
        });
        const responseJSON = await response.json();
        // console.log(responseJSON);
        createdCardsIds.push(responseJSON.id);
      }
    },
  );

  test.beforeEach('Create a new label', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const data: LabelDataModelSimplified = prepareRandomLabelDataSimplified(
      'red',
      'Do it ASAP',
      undefined,
      createdBoardId,
    );

    // Act: 'https://api.trello.com/1/labels?name={name}&color={color}&idBoard={idBoard}&key=APIKey&token=APIToken'
    const response = await request.post(`/1/labels`, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdBoardLabelId = responseJSON.id;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    const actualLabelName = responseJSON.name;
    expect(actualLabelName).toContain(data.name);
    const actualLabelColor = responseJSON.color;
    expect(actualLabelColor).toContain(data.color);
  });
  test('1. Should add label to card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const cardId = createdCardsIds[0];
    const data: LabelOperationsDataModelSimplified =
      prepareOperationDataSimplified(createdBoardLabelId);

    // Act: 'https://api.trello.com/1/cards/{id}/idLabels?key=APIKey&token=APIToken'
    const response = await request.post(`/1/cards/${cardId}/idLabels`, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualLabelId = responseJSON[0];
    expect(actualLabelId).toContain(createdBoardLabelId);
  });

  test('2. Should update whole label', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const data: LabelDataModelSimplified = prepareRandomLabelDataSimplified(
      'black',
      'Custom label for a card - updated for deadly',
      3,
    );

    // Act: 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken'
    const response = await request.put(`/1/labels/${createdBoardLabelId}`, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    const actualLabelId = responseJSON.id;
    expect(actualLabelId).toContain(createdBoardLabelId);
    const actualLabelName = responseJSON.name;
    expect(actualLabelName).toContain(data.name);
    const actualLabelColor = responseJSON.color;
    expect(actualLabelColor).toContain(data.color);
  });

  test.describe('Cards Labels handling - directly on Card - independent', () => {
    let createdLabelOnCardId: string;
    test.beforeEach('Create label directly on card', async ({ request }) => {
      // Arrange:
      const expectedStatusCode = 200;
      const cardId = createdCardsIds[1];
      const data: LabelDataModelSimplified = prepareRandomLabelDataSimplified(
        'yellow',
        '',
        2,
      );

      // Act: 'https://api.trello.com/1/cards/{id}/labels?color={color}&key=APIKey&token=APIToken'
      const response = await request.post(`/1/cards/${cardId}/labels`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);
      createdLabelOnCardId = responseJSON.id;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(responseJSON).toHaveProperty('id');
      const actualLabelName = responseJSON.name;
      expect(actualLabelName).toContain(data.name);
      const actualLabelColor = responseJSON.color;
      expect(actualLabelColor).toContain(data.color);
    });
    test('3. Should update field on label', async ({ request }) => {
      // Arrange:
      const expectedStatusCode = 200;
      const data: LabelDataModelSimplified = prepareRandomLabelDataSimplified();

      // Act: 'https://api.trello.com/1/labels/{id}/{field}?value=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      const response = await request.put(`/1/labels/${createdLabelOnCardId}`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualLabelId = responseJSON.id;
      expect(actualLabelId).toContain(createdLabelOnCardId);
      const actualLabelColor = responseJSON.color;
      expect(actualLabelColor).toContain(data.color);
    });
    test('4. Should delete label and verify whether resource exists', async ({
      request,
    }) => {
      await test.step('4.1 Should delete a label', async () => {
        // Arrange:
        const expectedStatusCode = 200;
        const expectedResponseValue = '{}';

        // Act: 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken'
        const response = await request.delete(
          `/1/labels/${createdLabelOnCardId}`,
          {
            headers,
            params,
          },
        );
        const responseJSON = await response.json();
        // console.log(responseJSON);

        // Assert:
        expect(response.status()).toEqual(expectedStatusCode);
        const actualResponseValue = JSON.stringify(responseJSON.limits);
        expect(actualResponseValue).toContain(expectedResponseValue);
      });
      await test.step('4.2 (NP) Should NOT get deleted label', async () => {
        // Arrange:
        const expectedStatusCode = 404;
        const expectedResponseStatusText = 'Not Found';

        // Act: 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken'
        const response = await request.get(
          `/1/labels/${createdLabelOnCardId}`,
          {
            headers,
            params,
          },
        );

        // Assert:
        expect(response.status()).toEqual(expectedStatusCode);
        expect(response.statusText()).toContain(expectedResponseStatusText);
      });
    });
  });

  test.afterAll('Delete a board', async ({ request }) => {
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
  });
});
