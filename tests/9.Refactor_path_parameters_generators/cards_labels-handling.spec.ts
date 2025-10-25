import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import {
  prepareOperationDataSimplified,
  prepareRandomLabelDataSimplified,
} from '@_src/API/factories/simplified_factories/cards_labels-data.factory';
import { generatePathURLSimplified } from '@_src/API/helpers/path_params_generators/path_params_simplified_generator/simplified_path_parameters_generator';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import {
  LabelDataModelSimplified,
  LabelOperationsDataModelSimplified,
} from '@_src/API/models/card_label_new_version_model/card_label_model_simplified';

import { headers, params } from '@_src/API/utils/api_utils';
import { pathParameters } from '@_src/API/utils/path_parameters_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Cards labels handling - path_generators', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  const createdCardsIds: string[] = [];
  let createdBoardLabelId: string;

  test.beforeAll(
    'Board, card preparation and collect lists ids',
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

      // Collect lists Id's
      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      const getListsUrl = generatePathURLSimplified(
        pathParameters.boardParameter,
        createdBoardId,
        'lists',
      );
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

      // Card Preparation
      for (let i = 0; i < 2; i++) {
        const cardCreationUrl = generatePathURLSimplified(
          pathParameters.cardParameter,
        );
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
        // const response = await request.post(`/1/cards`, {
        //   headers,
        //   params,
        //   data: dataCardCreation,
        // });
        const response = await request.post(cardCreationUrl, {
          headers,
          params,
          data: dataCardCreation,
        });
        const responseJSON = await response.json();
        const { id: actualCardId } = responseJSON;
        createdCardsIds.push(actualCardId);
      }
    },
  );

  test.beforeEach('Create a new label', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const createLabelURL = generatePathURLSimplified(
      pathParameters.labelParameter,
    );
    const data: LabelDataModelSimplified = prepareRandomLabelDataSimplified(
      'red',
      'Do it ASAP',
      undefined,
      createdBoardId,
    );
    const { color: expectedBoardLabelColor, name: expectedBoardLabeName } =
      data;

    // Act: 'https://api.trello.com/1/labels?name={name}&color={color}&idBoard={idBoard}&key=APIKey&token=APIToken'
    // const response = await request.post(`/1/labels`, {
    //   headers,
    //   params,
    //   data,
    // });
    const response = await request.post(createLabelURL, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    const {
      id: actualBoardLabelId,
      name: actualBoardLabelName,
      color: actualBoardLabelColor,
    } = responseJSON;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    expect(actualBoardLabelName).toContain(expectedBoardLabeName);
    expect(actualBoardLabelColor).toContain(expectedBoardLabelColor);

    createdBoardLabelId = actualBoardLabelId;
  });
  test('1. Should add label to card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const cardId = createdCardsIds[0];
    const addLabelToCardUrl = generatePathURLSimplified(
      pathParameters.cardParameter,
      cardId,
      'idLabels',
    );
    const data: LabelOperationsDataModelSimplified =
      prepareOperationDataSimplified(createdBoardLabelId);
    const { value: expectedBoardLabelId } = data;

    // Act: 'https://api.trello.com/1/cards/{id}/idLabels?key=APIKey&token=APIToken'
    // const response = await request.post(`/1/cards/${cardId}/idLabels`, {
    //   headers,
    //   params,
    //   data,
    // });
    const response = await request.post(addLabelToCardUrl, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    const [actualLabelId] = responseJSON;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(actualLabelId).toContain(expectedBoardLabelId);
  });

  test('2. Should update whole label', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const updateWholeLabelUrl = generatePathURLSimplified(
      pathParameters.labelParameter,
      createdBoardLabelId,
    );
    const data: LabelDataModelSimplified = prepareRandomLabelDataSimplified(
      'black',
      'Custom label for a card - updated for deadly',
      3,
    );
    const { color: expectedBoardLabelColor, name: expectedBoardLabelName } =
      data;

    // Act: 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken'
    // const response = await request.put(`/1/labels/${createdBoardLabelId}`, {
    //   headers,
    //   params,
    //   data,
    // });
    const response = await request.put(updateWholeLabelUrl, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    const {
      id: actualBoardLabelId,
      name: actualBoardLabelName,
      color: actualBoardLabelColor,
    } = responseJSON;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    expect(actualBoardLabelId).toContain(createdBoardLabelId);
    expect(actualBoardLabelName).toContain(expectedBoardLabelName);
    expect(actualBoardLabelColor).toContain(expectedBoardLabelColor);
  });

  test.describe('Cards Labels handling - directly on Card - independent', () => {
    let createdLabelOnCardId: string;
    test.beforeEach('Create label directly on card', async ({ request }) => {
      // Arrange:
      const expectedStatusCode = 200;
      const cardId = createdCardsIds[1];
      const createLabelOnCardPath = generatePathURLSimplified(
        pathParameters.cardParameter,
        cardId,
        'labels',
      );
      const data: LabelDataModelSimplified = prepareRandomLabelDataSimplified(
        'yellow',
        '',
        2,
      );
      const { color: expectedBoardLabelColor, name: expectedBoardLabelName } =
        data;

      // Act: 'https://api.trello.com/1/cards/{id}/labels?color={color}&key=APIKey&token=APIToken'
      // const response = await request.post(`/1/cards/${cardId}/labels`, {
      //   headers,
      //   params,
      //   data,
      // });
      const response = await request.post(createLabelOnCardPath, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      const {
        id: actualLabelId,
        name: actualLabelName,
        color: actualLabelColor,
      } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(responseJSON).toHaveProperty('id');
      expect(actualLabelName).toContain(expectedBoardLabelName);
      expect(actualLabelColor).toContain(expectedBoardLabelColor);

      createdLabelOnCardId = actualLabelId;
    });
    test('3. Should update field on label', async ({ request }) => {
      // Arrange:
      const expectedStatusCode = 200;
      const updateLabelFieldUrl = generatePathURLSimplified(
        pathParameters.labelParameter,
        createdLabelOnCardId,
      );
      const data: LabelDataModelSimplified = prepareRandomLabelDataSimplified();
      const { color: expectedLabelColor } = data;

      // Act: 'https://api.trello.com/1/labels/{id}/{field}?value=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken' -->
      // <-- incorrect documentation endpoint {field} should not be added in path parameters
      // const response = await request.put(`/1/labels/${createdLabelOnCardId}`, {
      //   headers,
      //   params,
      //   data,
      // });
      const response = await request.put(updateLabelFieldUrl, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      const { id: actualLabelId, color: actualLabelColor } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualLabelId).toContain(createdLabelOnCardId);
      expect(actualLabelColor).toContain(expectedLabelColor);
    });
    test('4. Should delete label and verify whether resource exists', async ({
      request,
    }) => {
      await test.step('4.1 Should delete a label', async () => {
        // Arrange:
        const expectedStatusCode = 200;
        const expectedResponseObject = {};
        const deleteLabelUrl = generatePathURLSimplified(
          pathParameters.labelParameter,
          createdLabelOnCardId,
        );

        // Act: 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken'
        // const response = await request.delete(
        //   `/1/labels/${createdLabelOnCardId}`,
        //   {
        //     headers,
        //     params,
        //   },
        // );
        const response = await request.delete(deleteLabelUrl, {
          headers,
          params,
        });
        const responseJSON = await response.json();
        const { limits: actualResponseObject } = responseJSON;

        // Assert:
        expect(response.status()).toEqual(expectedStatusCode);
        expect(actualResponseObject).toEqual(expectedResponseObject);
      });
      await test.step('4.2 (NP) Should NOT get deleted label', async () => {
        // Arrange:
        const expectedStatusCode = 404;
        const expectedResponseStatusText = 'Not Found';
        const getDeletedLabelUrl = generatePathURLSimplified(
          pathParameters.labelParameter,
          createdLabelOnCardId,
        );

        // Act: 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken'
        // const response = await request.get(
        //   `/1/labels/${createdLabelOnCardId}`,
        //   {
        //     headers,
        //     params,
        //   },
        // );
        const response = await request.get(getDeletedLabelUrl, {
          headers,
          params,
        });

        // Assert:
        expect(response.status()).toEqual(expectedStatusCode);
        expect(response.statusText()).toContain(expectedResponseStatusText);
      });
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
