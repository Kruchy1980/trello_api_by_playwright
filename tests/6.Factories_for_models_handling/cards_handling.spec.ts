import { prepareRandomBoardData } from '@_src/API/factories/board-data.factory';
import { prepareRandomCardData } from '@_src/API/factories/cards-data.factory';
import { prepareParamsData } from '@_src/API/factories/params-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Prepare factories for models handling
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Cards handling - factories implementation', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  test.beforeAll(
    'Board preparation and lists collection',
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
    // const data: CardDataModel = {
    //   idList: createdListsIds[0],
    //   name: 'My first card name',
    //   desc: 'My first card Description',
    //   due: new Date().toISOString(),
    // };
    const data: CardDataModel = prepareRandomCardData(
      createdListsIds[0],
      'Name',
      '',
      undefined,
      '',
      true,
      -1,
    );
    // console.log('Create', data);

    // console.log(
    //   'All params:',
    //   prepareRandomCardData(
    //     createdListsIds[0],
    //     'Name',
    //     'Desc',
    //     undefined,
    //     'top',
    //     true,
    //   ),
    // );
    // console.log(
    //   '5 params:',
    //   prepareRandomCardData(createdListsIds[0], 'Name', 'Desc', 2, 'top'),
    // );
    // console.log(
    //   '3 params:',
    //   prepareRandomCardData(createdListsIds[0], 'Name', 'Desc'),
    // );
    // console.log('2 params:', prepareRandomCardData(createdListsIds[0], 'Name'));
    // console.log('1 param:', prepareRandomCardData(createdListsIds[0]));
    // console.log(
    //   'Chosen param:',
    //   prepareRandomCardData(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     true,
    //   ),
    // );
    // console.log('No params:', prepareRandomCardData());

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
        // const data: CardDataModel = {
        //   name: 'My first card name - update',
        //   due: new Date(
        //     new Date().setDate(new Date().getDate() + 2),
        //   ).toISOString(),
        // };
        const data: CardDataModel = prepareRandomCardData(
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

      // const updatedCardParams: ParamsDataModel = {
      //   key: params.key,
      //   token: params.token,
      //   fields: 'name,desc,due',
      // };

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
      // const deletedCardParams: ParamsDataModel = {
      //   key: params.key,
      //   token: params.token,
      //   fields: 'name,desc,due',
      // };
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
