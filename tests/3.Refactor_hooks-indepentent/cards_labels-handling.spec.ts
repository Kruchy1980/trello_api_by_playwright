import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Make tests independent
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
  // let createdLabelOnCardId: string;

  test.beforeAll(
    'Board, card preparation and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const expectedBoardName = `My Board - ${new Date().toISOString().split('T')[1].split('Z')[0]}`;

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      const response = await request.post(
        `/1/boards/?name=${expectedBoardName}`,
        { headers, params },
      );
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
        const listId = createdListsIds[i];
        const expectedCardName = `Card for labels - ${new Date().getTime()}`;
        const expectedCardDueDate = new Date(
          new Date().setDate(new Date().getDate() + (i + 1)),
        ).toISOString();

        // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
        const response = await request.post(
          `/1/cards?idList=${listId}&name=${expectedCardName}&due=${expectedCardDueDate}`,
          { headers, params },
        );
        const responseJSON = await response.json();
        // console.log(responseJSON);
        createdCardsIds.push(responseJSON.id);
      }
      // console.log(createdCardsIds);
    },
  );

  test.beforeEach('Create a new label', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedLabelColor = 'red';
    const expectedLabelName = `Do it ASAP - ${expectedLabelColor}`;

    // Act: 'https://api.trello.com/1/labels?name={name}&color={color}&idBoard={idBoard}&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/labels?name=${expectedLabelName}&color=${expectedLabelColor}&idBoard=${createdBoardId}`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdBoardLabelId = responseJSON.id;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    const actualLabelName = responseJSON.name;
    expect(actualLabelName).toContain(expectedLabelName);
    const actualLabelColor = responseJSON.color;
    expect(actualLabelColor).toContain(expectedLabelColor);
  });
  test('1. Should add label to card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const cardId = createdCardsIds[0];

    // Act: 'https://api.trello.com/1/cards/{id}/idLabels?key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/cards/${cardId}/idLabels?value=${createdBoardLabelId}`,
      { headers, params },
    );
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
    const updatedLabelColor = 'black';
    const updatedLabelName = `Custom label for a card - updated for deadly - ${updatedLabelColor}`;

    // Act: 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/labels/${createdBoardLabelId}?color=${updatedLabelColor}&name=${updatedLabelName}`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    const actualLabelId = responseJSON.id;
    expect(actualLabelId).toContain(createdBoardLabelId);
    const actualLabelName = responseJSON.name;
    expect(actualLabelName).toContain(updatedLabelName);
    const actualLabelColor = responseJSON.color;
    expect(actualLabelColor).toContain(updatedLabelColor);
  });

  test.describe('Cards Labels handling - directly on Card - independent', () => {
    let createdLabelOnCardId: string;
    test.beforeEach('Create label directly on card', async ({ request }) => {
      // Arrange:
      const expectedStatusCode = 200;
      const cardId = createdCardsIds[1];
      const expectedLabelColor = 'yellow';
      const expectedLabelName = `Custom label for a card - ${expectedLabelColor}`;

      // Act: 'https://api.trello.com/1/cards/{id}/labels?color={color}&key=APIKey&token=APIToken'
      const response = await request.post(
        `/1/cards/${cardId}/labels?color=${expectedLabelColor}&name=${expectedLabelName}`,
        { headers, params },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);
      createdLabelOnCardId = responseJSON.id;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(responseJSON).toHaveProperty('id');
      const actualLabelName = responseJSON.name;
      expect(actualLabelName).toContain(expectedLabelName);
      const actualLabelColor = responseJSON.color;
      expect(actualLabelColor).toContain(expectedLabelColor);
    });
    test('1. Should update field on label', async ({ request }) => {
      // Arrange:
      const expectedStatusCode = 200;
      const updatedLabelColor = 'sky';

      // Act: 'https://api.trello.com/1/labels/{id}/{field}?value=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      const response = await request.put(
        `/1/labels/${createdLabelOnCardId}?color=${updatedLabelColor}`,
        { headers, params },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualLabelId = responseJSON.id;
      expect(actualLabelId).toContain(createdLabelOnCardId);
      const actualLabelColor = responseJSON.color;
      expect(actualLabelColor).toContain(updatedLabelColor);
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
