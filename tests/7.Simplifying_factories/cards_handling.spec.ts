import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';
import { prepareParamsData } from 'future/7.Refactor_simplifying_factories/part_1_finished/factories/params-data.factory';

// TODO: For refactoring
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Cards handling - simplified factories', () => {
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
      createdBoardId = responseJSON.id;

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
      // console.log(responseJSON);
      responseGetListsJSON.forEach((listId: { id: string }) => {
        createdListsIds.push(listId.id);
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

    // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.post(`/1/cards`, { headers, params, data });
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdCardId = responseJSON.id;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    const actualCardName = responseJSON.name;
    expect(actualCardName).toContain(data.name);
    const actualCardDescription = responseJSON.desc;
    expect(actualCardDescription).toContain(data.desc);
    const actualCardDueDate = responseJSON.due;
    expect(actualCardDueDate).toContain(data.due);
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

        // Act: 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
        const response = await request.put(`/1/cards/${createdCardId}`, {
          headers,
          params,
          data,
        });
        const responseJSON = await response.json();
        // console.log(responseJSON);

        // Assert:
        expect(response.status()).toEqual(expectedStatusCode);
        const actualCardId = responseJSON.id;
        expect(actualCardId).toContain(createdCardId);
        const actualCardName = responseJSON.name;
        expect(actualCardName).toContain(data.name);
        const actualCardDueDate = responseJSON.due;
        expect(actualCardDueDate).toContain(data.due);
        data.desc = responseJSON.desc;

        return data;
      });
    await test.step('1.2 Should get a Card fields', async () => {
      // Arrange:
      const expectedStatusCode = 200;

      const updatedCardParams: ParamsDataModel = prepareParamsData(
        '',
        '',
        '',
        '',
        false,
        '',
        'name,desc,due',
      );

      // Act: ('https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      const response = await request.get(`/1/cards/${createdCardId}`, {
        headers,
        params: { ...params, ...updatedCardParams },
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualCardId = responseJSON.id;
      expect(actualCardId).toContain(createdCardId);
      const actualCardName = responseJSON.name;
      expect(actualCardName).toContain(updatedCardValues.name);
      const actualCardDescription = responseJSON.desc;
      expect(actualCardDescription).toContain(updatedCardValues.desc);
      const actualCardDueDate = responseJSON.due;
      expect(actualCardDueDate).toContain(updatedCardValues.due);
    });
  });
  test('2. Delete and verify deleted card', async ({ request }) => {
    await test.step('2.1 Should delete a Card', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const expectedResponseObject = '{}';
      // Act: 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      const response = await request.delete(`/1/cards/${createdCardId}`, {
        headers,
        params,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);
      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualResponseObject = JSON.stringify(responseJSON.limits);
      expect(actualResponseObject).toContain(expectedResponseObject);
    });
    await test.step('2.2 (NP) Should NOT get deleted card', async () => {
      // Arrange:
      const expectedStatusCode = 404;
      const expectedStatusText = 'Not Found';
      const deletedCardParams: ParamsDataModel = prepareParamsData(
        '',
        '',
        '',
        '',
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
