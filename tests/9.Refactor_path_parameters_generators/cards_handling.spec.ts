import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { generatePathURLSimplified } from '@_src/API/helpers/path_params_generators/path_params_simplified_generator/simplified_path_parameters_generator';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { pathParameters } from '@_src/API/utils/path_parameters_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Improve tests by destructuring objects
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Cards handling - path_generators', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  test.beforeAll(
    'Board preparation and lists collection',
    async ({ request }) => {
      // Arrange:
      const boardURL = generatePathURLSimplified(pathParameters.boardParameter);
      const data: BoardDataModel = prepareRandomBoardDataSimplified();

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      // const response = await request.post(`/1/boards`, {
      //   headers,
      //   params,
      //   data,
      // });
      const response = await request.post(boardURL, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      const { id: actualBoardId } = responseJSON;

      createdBoardId = actualBoardId;

      // Collecting lists
      // Arrange:
      const getListsUrl = generatePathURLSimplified(
        pathParameters.boardParameter,
        createdBoardId,
        'lists',
      );
      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      // const responseListsIds = await request.get(
      //   `/1/boards/${createdBoardId}/lists`,
      //   {
      //     headers,
      //     params,
      //   },
      // );
      const responseGetLists = await request.get(getListsUrl, {
        headers,
        params,
      });
      const responseGetListsJSON = await responseGetLists.json();
      responseGetListsJSON.forEach(({ id }: { id: string }) => {
        createdListsIds.push(id);
      });
    },
  );
  test.beforeEach('Create a new card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const createCardUrl = generatePathURLSimplified(
      pathParameters.cardParameter,
    );

    const data: CardDataModel = prepareRandomCardDataSimplified(
      createdListsIds[0],
      'Name',
      '',
      undefined,
      '',
      true,
      -1,
    );
    const {
      name: expectedCardName,
      desc: expectedCardDescription,
      due: expectedCardDueDate,
    } = data;

    // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    // const response = await request.post(`/1/cards`, { headers, params, data });
    const response = await request.post(createCardUrl, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    const {
      id: actualCardId,
      name: actualCardName,
      desc: actualCardDescription,
      due: actualCardDueDate,
    } = responseJSON;

    // Assert
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    expect(actualCardName).toContain(expectedCardName);
    expect(actualCardDescription).toContain(expectedCardDescription);
    expect(actualCardDueDate).toContain(expectedCardDueDate);

    createdCardId = actualCardId;
  });

  test('1. Update and get updated card', async ({ request }) => {
    const updatedCardValues: CardDataModel =
      await test.step('1.1 Should update a Card', async () => {
        // Arrange:
        const expectedStatusCode = 200;
        const updateCardUrl = generatePathURLSimplified(
          pathParameters.cardParameter,
          createdCardId,
        );
        const data: CardDataModel = prepareRandomCardDataSimplified(
          '',
          'Updated: ',
          undefined,
          undefined,
          '',
          true,
          3,
        );
        const { name: expectedCardName, due: expectedCardDueDate } = data;

        // Act: 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
        // const response = await request.put(`/1/cards/${createdCardId}`, {
        //   headers,
        //   params,
        //   data,
        // });
        const response = await request.put(updateCardUrl, {
          headers,
          params,
          data,
        });
        const responseJSON = await response.json();
        const {
          id: actualCardId,
          name: actualCardName,
          desc: actualCardDescription,
          due: actualCardDueDate,
        } = responseJSON;

        // Assert
        expect(response.status()).toEqual(expectedStatusCode);
        expect(actualCardId).toContain(createdCardId);
        expect(actualCardName).toContain(expectedCardName);
        expect(actualCardDueDate).toContain(expectedCardDueDate);

        data.desc = actualCardDescription;

        return data;
      });
    await test.step('1.2 Should get a Card fields', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const getCardFieldsUrl = generatePathURLSimplified(
        pathParameters.cardParameter,
        createdCardId,
      );
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

      // Act: ('https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      // const response = await request.get(`/1/cards/${createdCardId}`, {
      //   headers,
      //   params: { ...params, ...updatedCardParams },
      // });
      const response = await request.get(getCardFieldsUrl, {
        headers,
        params: { ...params, ...updatedCardParams },
      });
      const responseJSON = await response.json();
      const {
        id: actualCardId,
        name: actualCardName,
        desc: actualCardDescription,
        due: actualCardDueDate,
      } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualCardId).toContain(createdCardId);
      expect(actualCardName).toContain(expectedCardName);
      expect(actualCardDescription).toContain(expectedCardDescription);
      expect(actualCardDueDate).toContain(expectedCardDueDate);
    });
  });
  test('2. Delete and verify deleted card', async ({ request }) => {
    await test.step('2.1 Should delete a Card', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const deleteCardUrl = generatePathURLSimplified(
        pathParameters.cardParameter,
        createdCardId,
      );
      const expectedResponseObject = {};
      // Act: 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      // const response = await request.delete(`/1/cards/${createdCardId}`, {
      //   headers,
      //   params,
      // });
      const response = await request.delete(deleteCardUrl, {
        headers,
        params,
      });
      const responseJSON = await response.json();
      const { limits: actualResponseObject } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualResponseObject).toEqual(expectedResponseObject);
    });
    await test.step('2.2 (NP) Should NOT get deleted card', async () => {
      // Arrange:
      const expectedStatusCode = 404;
      const expectedStatusText = 'Not Found';
      const getDeletedCardUrl = generatePathURLSimplified(
        pathParameters.cardParameter,
        createdCardId,
      );
      const deletedCardParams: ParamsDataModel = prepareParamsDataSimplified(
        '',
        '',
        '',
        undefined,
        false,
        '',
        'name,desc,due',
      );

      // Act: ('https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      // const response = await request.get(`/1/cards/${createdCardId}`, {
      //   headers,
      //   params: { ...params, ...deletedCardParams },
      // });
      const response = await request.get(getDeletedCardUrl, {
        headers,
        params: { ...params, ...deletedCardParams },
      });

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toContain(expectedStatusText);
    });
  });
  test.afterAll('Delete a board', async ({ request }) => {
    const deleteBoardUrl = generatePathURLSimplified(
      pathParameters.boardParameter,
      createdBoardId,
    );
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    // await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
    await request.delete(deleteBoardUrl, { headers, params });
  });
});
