import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import {
  CardLabelDataModel,
  LabelDataModel,
  LabelOperationsDataModel,
} from '@_src/API/models/card_labels-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Prepare models for data generation
// TODO: Prepare factories for models handling
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Cards labels handling - independent tests', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  const createdCardsIds: string[] = [];
  let createdBoardLabelId: string;
  // let data: { [key: string]: string };

  test.beforeAll(
    'Board, card preparation and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const data: BoardDataModel = {
        name: `My Board - ${new Date().toISOString().split('T')[1].split('Z')[0]}`,
      };

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
        // Arrange:
        const dataCardCreation: CardDataModel = {
          idList: createdListsIds[i],
          name: `Card for labels - ${new Date().getTime()}`,
          due: new Date(
            new Date().setDate(new Date().getDate() + (i + 1)),
          ).toISOString(),
        };

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
    // TODO: To Be updated later on
    const expectedLabelColor = 'red';
    const expectedLabelName = `Do it ASAP - ${expectedLabelColor}`;

    const data: LabelDataModel = {
      color: expectedLabelColor,
      name: expectedLabelName,
      idBoard: createdBoardId,
    };

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
    const data: LabelOperationsDataModel = {
      value: createdBoardLabelId,
    };

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
    // TODO: To be updated later on
    const updatedLabelColor = 'black';
    const updatedLabelName = `Custom label for a card - updated for deadly - ${updatedLabelColor}`;
    const data: CardLabelDataModel = {
      name: updatedLabelName,
      color: updatedLabelColor,
    };

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
      // TODO: To be updated later on
      const expectedLabelColor = 'yellow';
      const expectedLabelName = `Custom label for a card - ${expectedLabelColor}`;
      const data: CardLabelDataModel = {
        name: expectedLabelName,
        color: expectedLabelColor,
      };

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
    test('1. Should update field on label', async ({ request }) => {
      // Arrange:
      const expectedStatusCode = 200;
      const data: CardLabelDataModel = {
        color: 'sky',
      };

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
    test('2. Should delete label and verify whether resource exists', async ({
      request,
    }) => {
      await test.step('2.1 Should delete a label', async () => {
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
      await test.step('2.2 (NP) Should NOT get deleted label', async () => {
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
