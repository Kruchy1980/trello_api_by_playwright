import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { ChecklistDataModel } from '@_src/API/models/checklist-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';
import { prepareRandomBoardData } from 'future/7.Refactor_simplifying_factories/part_1_finished/factories/board-data.factory';
import { prepareRandomCardData } from 'future/7.Refactor_simplifying_factories/part_1_finished/factories/cards-data.factory';
import { prepareRandomChecklistData } from 'future/7.Refactor_simplifying_factories/part_1_finished/factories/checklist-data.factory';

// TODO: For refactoring
// TODO: Prepare models for data generation
// TODO: Prepare factories for models handling
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Checklists_handling - factories implementation', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  let createdChecklistId: string;
  let data: ChecklistDataModel;
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
      // const cardCreationData = {
      //   idList: createdListsIds[0],
      //   name: 'My first card for comments name',
      //   due: new Date(
      //     new Date().setDate(new Date().getDate() + 2),
      //   ).toISOString(),
      // };
      const cardCreationData: CardDataModel = prepareRandomCardData(
        createdListsIds[0],
        'My first card for comments name',
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

  test.beforeEach('Add checklist to card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    // data = {
    //   idCard: createdCardId,
    //   name: 'Checklist added by user',
    // };
    data = prepareRandomChecklistData(
      createdCardId,
      'Checklist added by user',
      3,
    );

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
    // const data: ChecklistDataModel = {
    //   name: 'Checklist added by user - once updated',
    //   pos: 'bottom',
    // };
    const data: ChecklistDataModel = prepareRandomChecklistData(
      '',
      'Checklist added by user - once updated',
      undefined,
      'bottom',
    );
    // console.log('Update checklist:', data);

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
    let checklistDataForVerification: ChecklistDataModel;
    await test.step('3.1 Should Update a checklist name only', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      // const data: ChecklistDataModel = {
      //   value: 'Checklist updated name only',
      // };
      const data: ChecklistDataModel = prepareRandomChecklistData(
        undefined,
        undefined,
        undefined,
        undefined,
        'Checklist updated name only',
        2,
      );
      // console.log('Update name value only:', data);

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
      // Passing data - direct value to the inside test variable
      checklistDataForVerification = data;
    });
    await test.step('3.2 Should Get a checklist name only', async () => {
      // Arrange:
      const expectedStatusCode = 200;

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
      expect(actualChecklistName).toContain(checklistDataForVerification.value);
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
