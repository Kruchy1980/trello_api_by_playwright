import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Prepare models for data generation
// TODO: Prepare factories for models handling
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Checklists_handling - independent tests', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  let createdChecklistId: string;
  let data: { [key: string]: string };
  test.beforeAll(
    'Board, card preparation and collect lists ids',
    async ({ request }) => {
      // Arrange:
      // const expectedBoardName = `My Board - ${new Date().toISOString().split('T')[1].split('Z')[0]}`;
      data = {
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
      // Arrange:
      // const usedListId = createdListsIds[0];

      // const expectedCardName = 'My first card for comments name';
      // const expectedCardDueDate = new Date(
      //   new Date().setDate(new Date().getDate() + 2),
      // ).toISOString();
      data = {
        idList: createdListsIds[0],
        name: 'My first card for comments name',
        due: new Date(
          new Date().setDate(new Date().getDate() + 2),
        ).toISOString(),
      };

      // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      const responseCardCreation = await request.post(`/1/cards`, {
        headers,
        params,
        data,
      });
      const responseCardCreationJSON = await responseCardCreation.json();
      // console.log(responseJSON);
      createdCardId = responseCardCreationJSON.id;
    },
  );

  test.beforeEach('Add checklist to card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    // const expectedChecklistName = 'Checklist added by user';
    data = {
      idCard: createdCardId,
      name: 'Checklist added by user',
    };

    // Act: 'https://api.trello.com/1/checklists?idCard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.post(`/1/checklists`, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdChecklistId = responseJSON.id;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualChecklistName = responseJSON.name;
    expect(actualChecklistName).toContain(data.name);
  });
  test('1. Should Get a checklist data', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    // const expectedChecklistName = 'Checklist added by user';

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    const response = await request.get(`/1/checklists/${createdChecklistId}`, {
      headers,
      params,
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualChecklistId = responseJSON.id;
    expect(actualChecklistId).toContain(createdChecklistId);
    const actualChecklistName = responseJSON.name;
    expect(actualChecklistName).toContain(data.name);
  });
  test('2. Should Update a checklist data', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    // const updatedChecklistName = 'Checklist added by user - once updated';
    // const position = 'bottom';
    data = {
      name: 'Checklist added by user - once updated',
      pos: 'bottom',
    };

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    const response = await request.put(`/1/checklists/${createdChecklistId}`, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualChecklistId = responseJSON.id;
    expect(actualChecklistId).toContain(createdChecklistId);
    const actualChecklistName = responseJSON.name;
    expect(actualChecklistName).toContain(data.name);
  });

  test('3. Update and verify checklist name', async ({ request }) => {
    await test.step('3.1 Should Update a checklist name only', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      // const updatedChecklistName = 'Checklist updated name only';
      data = {
        value: 'Checklist updated name only',
      };

      // Act: 'https://api.trello.com/1/checklists/{id}/{field}?value={value}&key=APIKey&token=APIToken'
      const response = await request.put(
        `/1/checklists/${createdChecklistId}/name`,
        { headers, params, data },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualChecklistId = responseJSON.id;
      expect(actualChecklistId).toContain(createdChecklistId);
      const actualChecklistName = responseJSON.name;
      expect(actualChecklistName).toContain(data.value);
    });
    await test.step('3.2 (NP) Should Get a checklist name only', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      // const expectedChecklistName = 'Checklist updated name only';

      // Act: 'https://api.trello.com/1/checklists/{id}/{field}?key=APIKey&token=APIToken'
      const response = await request.get(
        `/1/checklists/${createdChecklistId}/name`,
        { headers, params },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualChecklistName = responseJSON._value;
      expect(actualChecklistName).toContain(data.value);
    });
  });

  test('4. Delete checklist and verify success', async ({ request }) => {
    await test.step('4.1 Should delete a checklist', async () => {
      //Arrange:
      const expectedStatusCode = 200;
      const expectedResponseObject = {};

      // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
      const response = await request.delete(
        `/1/checklists/${createdChecklistId}`,
        { headers, params },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualChecklistObject = responseJSON.limits;
      expect(actualChecklistObject).toEqual(expectedResponseObject);
    });
    await test.step('4.2 (NP) Should NOT get deleted checklist', async () => {
      // Arrange:
      const expectedStatusCode = 404;
      const expectedStatusText = 'Not Found';

      // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
      const response = await request.delete(
        `/1/checklists/${createdChecklistId}`,
        { headers, params },
      );

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toEqual(expectedStatusText);
    });
  });
  test.afterAll('Delete a board', async ({ request }) => {
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
  });
});
