import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Improve tests by destructuring objects
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Cards handling - destructured', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  test.beforeAll(
    'Board preparation and lists collection',
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

      // Collecting lists
      // Arrange:
      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      const responseGetLists = await request.get(
        `/1/boards/${createdBoardId}/lists`,
        {
          headers,
          params,
        },
      );
      const responseGetListsJSON = await responseGetLists.json();
      // console.log('Collecting Lists Ids', responseListsIdsJSON);
      // Before destructuring
      // responseListsIdsJSON.forEach((listId: { id: string }) => {
      //   createdListsIds.push(listId.id);
      // After destructuring - destructurization inside loop
      responseGetListsJSON.forEach(({ id }: { id: string }) => {
        createdListsIds.push(id);
      });
    },
  );
  test.beforeEach('Create a new card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;

    const data: CardDataModel = prepareRandomCardDataSimplified(
      createdListsIds[0],
      'Name',
      '',
      undefined,
      '',
      true,
      -1,
    );
    // console.log('Create', data);
    // Destructuring data object
    const {
      name: expectedCardName,
      desc: expectedCardDescription,
      due: expectedCardDueDate,
    } = data;

    // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.post(`/1/cards`, { headers, params, data });
    const responseJSON = await response.json();
    // console.log('Card Preparation:', responseJSON);
    // console.log('Card Preparation ID:', responseJSON.id);
    // Destructuring responseJSON object
    const {
      id: actualCardId,
      name: actualCardName,
      desc: actualCardDescription,
      due: actualCardDueDate,
    } = responseJSON;

    // Assert:
    // Before Destructuring
    // expect(response.status()).toEqual(expectedStatusCode);
    // expect(responseJSON).toHaveProperty('id');
    // const actualCardName = responseJSON.name;
    // expect(actualCardName).toContain(data.name);
    // const actualCardDescription = responseJSON.desc;
    // expect(actualCardDescription).toContain(data.desc);
    // const actualCardDueDate = responseJSON.due;
    // expect(actualCardDueDate).toContain(data.due);
    // === Assigning Actual CardId ===
    createdCardId = responseJSON.id;
    // After destructuring
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    // const actualCardName = responseJSON.name;
    expect(actualCardName).toContain(expectedCardName);
    // const actualCardDescription = responseJSON.desc;
    expect(actualCardDescription).toContain(expectedCardDescription);
    // const actualCardDueDate = responseJSON.due;
    expect(actualCardDueDate).toContain(expectedCardDueDate);
    // === Assigning Actual CardId ===
    createdCardId = actualCardId;
  });

  test('1. Update and get updated card', async ({ request }) => {
    const updatedCardValues: CardDataModel =
      await test.step('1.1 Should update a Card', async () => {
        // Arrange:
        const expectedStatusCode = 200;
        const data: CardDataModel = prepareRandomCardDataSimplified(
          '',
          'Updated: ',
          undefined,
          undefined,
          '',
          true,
          3,
        );
        // console.log('Update:', data);
        // Destructuring data object
        const { name: expectedCardName, due: expectedCardDueDate } = data;

        // Act: 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
        const response = await request.put(`/1/cards/${createdCardId}`, {
          headers,
          params,
          data,
        });
        const responseJSON = await response.json();
        // console.log(responseJSON);
        // Destructuring responseJSON Object
        const {
          id: actualCardId,
          name: actualCardName,
          desc: actualCardDescription,
          due: actualCardDueDate,
        } = responseJSON;

        // Assert:
        // Before Destructuring
        // expect(response.status()).toEqual(expectedStatusCode);
        // const actualCardId = responseJSON.id;
        // expect(actualCardId).toContain(createdCardId);
        // const actualCardName = responseJSON.name;
        // expect(actualCardName).toContain(data.name);
        // const actualCardDueDate = responseJSON.due;
        // expect(actualCardDueDate).toContain(data.due);
        // === Assigning old desc value to data Object ===
        // data.desc = responseJSON.desc;

        // return data;
        // After Destructuring
        expect(response.status()).toEqual(expectedStatusCode);
        // const actualCardId = responseJSON.id;
        expect(actualCardId).toContain(createdCardId);
        // const actualCardName = responseJSON.name;
        expect(actualCardName).toContain(expectedCardName);
        // const actualCardDueDate = responseJSON.due;
        expect(actualCardDueDate).toContain(expectedCardDueDate);
        // === Assigning old desc value to data Object ===
        data.desc = actualCardDescription;
        // Returning whole data object updated with description
        return data;
      });
    await test.step('1.2 Should get a Card fields', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      // Destructuring passed updatedCardValues object
      // console.log(updatedCardValues);
      const {
        name: expectedCardName,
        desc: expectedCardDescription,
        due: expectedCardDueDate,
      } = updatedCardValues;

      const updatedCardParams: ParamsDataModel = prepareParamsDataSimplified(
        '',
        '',
        '',
        undefined,
        false,
        '',
        'name,desc,due',
      );
      // console.log(updatedCardParams);

      // Act: ('https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      const response = await request.get(`/1/cards/${createdCardId}`, {
        headers,
        params: { ...params, ...updatedCardParams },
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);
      // Destructuring responseJSON object
      const {
        id: actualCardId,
        name: actualCardName,
        desc: actualCardDescription,
        due: actualCardDueDate,
      } = responseJSON;

      // Assert:
      // Before Destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualCardId = responseJSON.id;
      // expect(actualCardId).toContain(createdCardId);
      // const actualCardName = responseJSON.name;
      // expect(actualCardName).toContain(updatedCardValues.name);
      // const actualCardDescription = responseJSON.desc;
      // expect(actualCardDescription).toContain(updatedCardValues.desc);
      // const actualCardDueDate = responseJSON.due;
      // expect(actualCardDueDate).toContain(updatedCardValues.due);

      // After Destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualCardId = responseJSON.id;
      expect(actualCardId).toContain(createdCardId);
      // const actualCardName = responseJSON.name;
      expect(actualCardName).toContain(expectedCardName);
      // const actualCardDescription = responseJSON.desc;
      expect(actualCardDescription).toContain(expectedCardDescription);
      // const actualCardDueDate = responseJSON.due;
      expect(actualCardDueDate).toContain(expectedCardDueDate);
    });
  });
  test('2. Delete and verify deleted card', async ({ request }) => {
    await test.step('2.1 Should delete a Card', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      // Before destructuring
      // const expectedResponseObject = '{}';
      // After destructuring
      const expectedResponseObject = {};
      // Act: 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      const response = await request.delete(`/1/cards/${createdCardId}`, {
        headers,
        params,
      });
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
      // Solution II if we are interested in subSet of properties in returned object - not recommended in this test
      // expect(actualResponseObject).toMatchObject(expectedResponseObject);
    });
    await test.step('2.2 (NP) Should NOT get deleted card', async () => {
      // Arrange: !!! No destructuring Needed
      const expectedStatusCode = 404;
      const expectedStatusText = 'Not Found';
      const deletedCardParams: ParamsDataModel = prepareParamsDataSimplified(
        '',
        '',
        '',
        undefined,
        false,
        '',
        'name,desc,due',
      );
      // console.log(deletedCardParams);
      // Act: ('https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      const response = await request.get(`/1/cards/${createdCardId}`, {
        headers,
        params: { ...params, ...deletedCardParams },
      });
      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toContain(expectedStatusText);
    });
  });
  test.afterAll('Delete a board', async ({ request }) => {
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
  });
});
