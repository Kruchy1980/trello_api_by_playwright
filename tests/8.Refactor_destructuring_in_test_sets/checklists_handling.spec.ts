import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareRandomChecklistDataSimplified } from '@_src/API/factories/simplified_factories/checklist-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { ChecklistDataModel } from '@_src/API/models/checklist-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Improve tests by destructuring objects
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Checklists_handling - destructured', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  let createdChecklistId: string;
  let data: ChecklistDataModel;
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
      // Arrange:
      const cardCreationData: CardDataModel = prepareRandomCardDataSimplified(
        createdListsIds[0],
        'My first card for comments name',
        undefined,
        undefined,
        undefined,
        true,
      );
      // !! No need to destructure data object here
      // because in beforeAll Hook we are using only id for being passed to variable

      // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      const responseCardCreation = await request.post(`/1/cards`, {
        headers,
        params,
        data: cardCreationData,
      });
      const responseCardCreationJSON = await responseCardCreation.json();
      // console.log(responseJSON);
      // Destructuring responseCardCreationJSON
      const { id: actualCardCreationId } = responseCardCreationJSON;
      // Before Destructuring
      // createdCardId = responseCardCreationJSON.id;
      // Before Destructuring
      createdCardId = actualCardCreationId;
    },
  );

  test.beforeEach('Add checklist to card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    data = prepareRandomChecklistDataSimplified(createdCardId, '', 3);
    // console.log('Before Each data:', data);
    // Destructuring data object for assertion
    const { name: expectedChecklistName } = data;

    // Act: 'https://api.trello.com/1/checklists?idCard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.post(`/1/checklists`, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // Destructuring responseJSON object
    const { id: actualChecklistId, name: actualChecklistName } = responseJSON;

    // // Assert:
    // Before Destructuring
    // expect(response.status()).toEqual(expectedStatusCode);
    // const actualChecklistName = responseJSON.name;
    // expect(actualChecklistName).toContain(data.name);
    // ===Passing id of checklist to variable ===
    // createdChecklistId = responseJSON.id;

    // After Destructuring
    expect(response.status()).toEqual(expectedStatusCode);
    // const actualChecklistName = responseJSON.name;
    expect(actualChecklistName).toContain(expectedChecklistName);
    // ===Passing id of checklist to variable ===
    createdChecklistId = actualChecklistId;
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
    // Destructing responseJSON object
    const { id: actualChecklistId, name: actualChecklistName } = responseJSON;

    // Assert:
    // Before Destructing
    // expect(response.status()).toEqual(expectedStatusCode);
    // const actualChecklistId = responseJSON.id;
    // expect(actualChecklistId).toContain(createdChecklistId);
    // const actualChecklistName = responseJSON.name;
    // expect(actualChecklistName).toContain(data.name);
    // After Destructing
    expect(response.status()).toEqual(expectedStatusCode);
    // const actualChecklistId = responseJSON.id;
    expect(actualChecklistId).toContain(createdChecklistId);
    // const actualChecklistName = responseJSON.name;
    expect(actualChecklistName).toContain(data.name);
  });
  test('2. Should Update a checklist data', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const data: ChecklistDataModel = prepareRandomChecklistDataSimplified(
      '',
      'Checklist added by user - once updated',
      undefined,
      'bottom',
    );
    // console.log('Update checklist:', data);
    // Destructing data object
    const { name: expectedChecklistName } = data;

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    const response = await request.put(`/1/checklists/${createdChecklistId}`, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // Destructing responseJSON object
    const { id: actualChecklistId, name: actualChecklistName } = responseJSON;

    // Assert:
    // Before destructing
    // expect(response.status()).toEqual(expectedStatusCode);
    // const actualChecklistId = responseJSON.id;
    // expect(actualChecklistId).toContain(createdChecklistId);
    // const actualChecklistName = responseJSON.name;
    // expect(actualChecklistName).toContain(data.name);
    // After destructing
    expect(response.status()).toEqual(expectedStatusCode);
    // const actualChecklistId = responseJSON.id;
    expect(actualChecklistId).toContain(createdChecklistId);
    // const actualChecklistName = responseJSON.name;
    expect(actualChecklistName).toContain(expectedChecklistName);
  });

  test('3. Update and verify checklist name', async ({ request }) => {
    // Old attitude when object returning
    // let checklistDataForVerification: ChecklistDataModel;
    // New attitude - returning only value of string
    let checklistDataForVerification: string | undefined;
    await test.step('3.1 Should Update a checklist name only', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const data: ChecklistDataModel = prepareRandomChecklistDataSimplified(
        undefined,
        undefined,
        undefined,
        undefined,
        'Checklist updated name only',
        2,
      );
      // console.log('Update name value only:', data);
      // Destructuring data object
      const { value: expectedChecklistName } = data;

      // Act: 'https://api.trello.com/1/checklists/{id}/{field}?value={value}&key=APIKey&token=APIToken'
      const response = await request.put(
        `/1/checklists/${createdChecklistId}/name`,
        { headers, params, data },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);
      // Destructuring responseJSON object
      const { id: actualChecklistId, name: actualChecklistName } = responseJSON;

      // Assert:
      // Before destructing
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualChecklistId = responseJSON.id;
      // expect(actualChecklistId).toContain(createdChecklistId);
      // const actualChecklistName = responseJSON.name;
      // expect(actualChecklistName).toContain(data.value);
      // // ===Passing data - direct value to the inside test variable ===
      // checklistDataForVerification = data;
      // After destructing
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualChecklistId = responseJSON.id;
      expect(actualChecklistId).toContain(createdChecklistId);
      // const actualChecklistName = responseJSON.name;
      expect(actualChecklistName).toContain(expectedChecklistName);
      // Passing data - direct value to the inside test variable
      checklistDataForVerification = expectedChecklistName;
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
      // Destructuring responseJSON object
      const { _value: actualChecklistName } = responseJSON;

      // Assert:
      // Before destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualChecklistName = responseJSON._value;
      // expect(actualChecklistName).toContain(checklistDataForVerification.value);
      // After destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualChecklistName = responseJSON._value;
      expect(actualChecklistName).toContain(checklistDataForVerification);
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
      // Destructuring responseJSON object
      const { limits: actualChecklistObject } = responseJSON;

      // Assert:
      // Before destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualChecklistObject = responseJSON.limits;
      // expect(actualChecklistObject).toEqual(expectedResponseObject);
      // After destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualChecklistObject = responseJSON.limits;
      expect(actualChecklistObject).toEqual(expectedResponseObject);
    });
    await test.step('4.2 (NP) Should NOT get deleted checklist', async () => {
      // Arrange: !! No destructuring needed
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
