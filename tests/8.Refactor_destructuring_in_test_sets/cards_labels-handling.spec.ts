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
// TODO: Improve tests by destructuring objects
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Cards labels handling - destructured', () => {
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
      // Destructuring responseJSON object
      const { id: expectedBoardId } = responseJSON;
      // Before Destructuring
      // createdBoardId = responseJSON.id;
      // Before Destructuring
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
      // Before destructuring:
      // responseListsIdsJSON.forEach((listId: { id: string }) => {
      //   createdListsIds.push(listId.id);
      // After destructuring - destructure inside loop
      responseListsIdsJSON.forEach(({ id }: { id: string }) => {
        createdListsIds.push(id);
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
        // Destructuring JSON
        const { id: actualCardId } = responseJSON;
        // Before destructuring
        // createdCardsIds.push(responseJSON.id);
        // After destructuring
        createdCardsIds.push(actualCardId);
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
    // console.log('Before Each data:', data);
    // Destructuring data object
    const { color: expectedBoardLabelColor, name: expectedBoardLabeName } =
      data;

    // Act: 'https://api.trello.com/1/labels?name={name}&color={color}&idBoard={idBoard}&key=APIKey&token=APIToken'
    const response = await request.post(`/1/labels`, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    // console.log('Response JSON for board label:', responseJSON);
    // console.log(responseJSON.id);
    // Destructuring JSON
    const {
      id: actualBoardLabelId,
      name: actualBoardLabelName,
      color: actualBoardLabelColor,
    } = responseJSON;

    // Assert:
    // Before destructuring
    // expect(response.status()).toEqual(expectedStatusCode);
    // expect(responseJSON).toHaveProperty('id');
    // const actualLabelName = responseJSON.name;
    // expect(actualLabelName).toContain(data.name);
    // const actualLabelColor = responseJSON.color;
    // expect(actualLabelColor).toContain(data.color);
    // ===== Passing Label ID to variable ====
    // createdBoardLabelId = responseJSON.id;

    // After destructuring
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    // const actualBoardLabelName = responseJSON.name;
    expect(actualBoardLabelName).toContain(expectedBoardLabeName);
    // const actualBoardLabelColor = responseJSON.color;
    expect(actualBoardLabelColor).toContain(expectedBoardLabelColor);
    // ===== Passing Label ID to variable ====
    createdBoardLabelId = actualBoardLabelId;
  });
  test('1. Should add label to card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const cardId = createdCardsIds[0];
    const data: LabelOperationsDataModelSimplified =
      prepareOperationDataSimplified(createdBoardLabelId);
    // Destructuring data object
    // console.log('Assigning data object:', data);
    const { value: expectedBoardLabelId } = data;

    // Act: 'https://api.trello.com/1/cards/{id}/idLabels?key=APIKey&token=APIToken'
    const response = await request.post(`/1/cards/${cardId}/idLabels`, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    // console.log('Assigning BoardLabeL ID JSON:', responseJSON);
    // Destructuring JSON Value from an Array
    const [actualLabelId] = responseJSON;
    // // console.log(actualLabelId);

    // Assert:
    // Before Destructuring
    // expect(response.status()).toEqual(expectedStatusCode);
    // const actualLabelId = responseJSON[0];
    // expect(actualLabelId).toContain(expectedBoardLabelId);
    // After Destructuring
    expect(response.status()).toEqual(expectedStatusCode);
    // const actualLabelId = responseJSON[0];
    expect(actualLabelId).toContain(expectedBoardLabelId);
  });

  test('2. Should update whole label', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const data: LabelDataModelSimplified = prepareRandomLabelDataSimplified(
      'black',
      'Custom label for a card - updated for deadly',
      3,
    );
    // console.log('Update label data:', data);
    // Destructuring data object
    const { color: expectedBoardLabelColor, name: expectedBoardLabelName } =
      data;

    // Act: 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken'
    const response = await request.put(`/1/labels/${createdBoardLabelId}`, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    // console.log('Response from Update:', responseJSON);
    // Destructuring JSON object
    const {
      id: actualBoardLabelId,
      name: actualBoardLabelName,
      color: actualBoardLabelColor,
    } = responseJSON;
    // Assert:
    // Before destructuring
    // expect(response.status()).toEqual(expectedStatusCode);
    // expect(responseJSON).toHaveProperty('id');
    // const actualLabelId = responseJSON.id;
    // expect(actualLabelId).toContain(createdBoardLabelId);
    // const actualLabelName = responseJSON.name;
    // expect(actualLabelName).toContain(data.name);
    // const actualLabelColor = responseJSON.color;
    // expect(actualLabelColor).toContain(data.color);
    // After destructuring
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    // const actualBoardLabelId = responseJSON.id;
    expect(actualBoardLabelId).toContain(createdBoardLabelId);
    // const actualBoardLabelName = responseJSON.name;
    expect(actualBoardLabelName).toContain(expectedBoardLabelName);
    // const actualBoardLabelColor = responseJSON.color;
    expect(actualBoardLabelColor).toContain(expectedBoardLabelColor);
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
      // console.log('Label directly on card data', data);
      // Destructuring data object
      const { color: expectedBoardLabelColor, name: expectedBoardLabelName } =
        data;

      // Act: 'https://api.trello.com/1/cards/{id}/labels?color={color}&key=APIKey&token=APIToken'
      const response = await request.post(`/1/cards/${cardId}/labels`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log('Create Label on card directly JSON', responseJSON);
      // Destructuring responseJSON object
      const {
        id: actualLabelId,
        name: actualLabelName,
        color: actualLabelColor,
      } = responseJSON;

      // Assert:
      // Before destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // expect(responseJSON).toHaveProperty('id');
      // const actualLabelName = responseJSON.name;
      // expect(actualLabelName).toContain(data.name);
      // const actualLabelColor = responseJSON.color;
      // expect(actualLabelColor).toContain(data.color);
      // ==== Passing label Id to variable ====
      // createdLabelOnCardId = responseJSON.id;
      // After destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      expect(responseJSON).toHaveProperty('id');
      // const actualLabelName = responseJSON.name;
      expect(actualLabelName).toContain(expectedBoardLabelName);
      // const actualLabelColor = responseJSON.color;
      expect(actualLabelColor).toContain(expectedBoardLabelColor);
      // ==== Passing label Id to variable ====
      createdLabelOnCardId = actualLabelId;
    });
    test('3. Should update field on label', async ({ request }) => {
      // Arrange:
      const expectedStatusCode = 200;
      const data: LabelDataModelSimplified = prepareRandomLabelDataSimplified();
      // console.log('Update label object', data);
      // Destructuring object
      const { color: expectedLabelColor } = data;

      // Act: 'https://api.trello.com/1/labels/{id}/{field}?value=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      const response = await request.put(`/1/labels/${createdLabelOnCardId}`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log('Update label response JSON', responseJSON);
      // Destructuring responseJSON object
      const { id: actualLabelId, color: actualLabelColor } = responseJSON;

      // Assert:
      // Before Destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualLabelId = responseJSON.id;
      // expect(actualLabelId).toContain(createdLabelOnCardId);
      // const actualLabelColor = responseJSON.color;
      // expect(actualLabelColor).toContain(data.color);
      // After Destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualLabelId = responseJSON.id;
      expect(actualLabelId).toContain(createdLabelOnCardId);
      // const actualLabelColor = responseJSON.color;
      expect(actualLabelColor).toContain(expectedLabelColor);
    });
    test('4. Should delete label and verify whether resource exists', async ({
      request,
    }) => {
      await test.step('4.1 Should delete a label', async () => {
        // Arrange:
        const expectedStatusCode = 200;
        // Before destructuring
        // const expectedResponseObject = '{}';
        // After destructuring
        const expectedResponseObject = {};

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
        // Destructuring response JSON
        const { limits: actualResponseObject } = responseJSON;
        // console.log('Value from JSON', actualResponseObject);

        // Assert:
        // Before Destructuring
        // expect(response.status()).toEqual(expectedStatusCode);
        // const actualResponseObject = JSON.stringify(responseJSON.limits);
        // expect(actualResponseObject).toContain(expectedResponseObject);

        // After Destructuring
        expect(response.status()).toEqual(expectedStatusCode);
        // const actualResponseObject = JSON.stringify(responseJSON.limits);
        expect(actualResponseObject).toEqual(expectedResponseObject);
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
