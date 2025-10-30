import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareRandomChecklistDataSimplified } from '@_src/API/factories/simplified_factories/checklist-data.factory';
import { generatePathURLSimplified } from '@_src/API/helpers/path_params_generators/path_params_simplified_generator/simplified_path_parameters_generator';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { ChecklistDataModel } from '@_src/API/models/checklist-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { pathParameters } from '@_src/API/utils/path_parameters_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Checklists_handling - path_generators', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  let createdChecklistId: string;
  let data: ChecklistDataModel;
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
      // Arrange:
      const cardCreationURL = generatePathURLSimplified(
        pathParameters.cardParameter,
      );
      const cardCreationData: CardDataModel = prepareRandomCardDataSimplified(
        createdListsIds[0],
        'My first card for comments name',
        undefined,
        undefined,
        undefined,
        true,
      );

      // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      // const responseCardCreation = await request.post(`/1/cards`, {
      //   headers,
      //   params,
      //   data: cardCreationData,
      // });
      const responseCardCreation = await request.post(cardCreationURL, {
        headers,
        params,
        data: cardCreationData,
      });
      const responseCardCreationJSON = await responseCardCreation.json();
      const { id: actualCardCreationId } = responseCardCreationJSON;

      createdCardId = actualCardCreationId;
    },
  );

  test.beforeEach('Add checklist to card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const addChecklistToCardUrl = generatePathURLSimplified(
      pathParameters.checklistParameter,
    );
    data = prepareRandomChecklistDataSimplified(createdCardId, '', 3);
    const { name: expectedChecklistName } = data;

    // Act: 'https://api.trello.com/1/checklists?idCard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    // const response = await request.post(`/1/checklists`, {
    //   headers,
    //   params,
    //   data,
    // });
    const response = await request.post(addChecklistToCardUrl, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    const { id: actualChecklistId, name: actualChecklistName } = responseJSON;

    // // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(actualChecklistName).toContain(expectedChecklistName);

    createdChecklistId = actualChecklistId;
  });
  test('1. Should Get a checklist data', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const getChecklistUrl = generatePathURLSimplified(
      pathParameters.checklistParameter,
      createdChecklistId,
    );

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    // const response = await request.get(`/1/checklists/${createdChecklistId}`, {
    //   headers,
    //   params,
    // });
    const response = await request.get(getChecklistUrl, {
      headers,
      params,
    });
    const responseJSON = await response.json();
    const { id: actualChecklistId, name: actualChecklistName } = responseJSON;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(actualChecklistId).toContain(createdChecklistId);
    expect(actualChecklistName).toContain(data.name);
  });
  test('2. Should Update a checklist data', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const updateChecklistData = generatePathURLSimplified(
      pathParameters.checklistParameter,
      createdChecklistId,
    );
    const data: ChecklistDataModel = prepareRandomChecklistDataSimplified(
      '',
      'Checklist added by user - once updated',
      undefined,
      'bottom',
    );
    const { name: expectedChecklistName } = data;

    // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
    // const response = await request.put(`/1/checklists/${createdChecklistId}`, {
    //   headers,
    //   params,
    //   data,
    // });
    const response = await request.put(updateChecklistData, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    const { id: actualChecklistId, name: actualChecklistName } = responseJSON;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(actualChecklistId).toContain(createdChecklistId);
    expect(actualChecklistName).toContain(expectedChecklistName);
  });

  test('3. Update and verify checklist name', async ({ request }) => {
    let checklistDataForVerification: string | undefined;
    await test.step('3.1 Should Update a checklist name only', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const updateChecklistNameUrl = generatePathURLSimplified(
        pathParameters.checklistParameter,
        createdChecklistId,
        'name',
      );
      const data: ChecklistDataModel = prepareRandomChecklistDataSimplified(
        undefined,
        undefined,
        undefined,
        undefined,
        'Checklist updated name only',
        2,
      );
      const { value: expectedChecklistName } = data;

      // Act: 'https://api.trello.com/1/checklists/{id}/{field}?value={value}&key=APIKey&token=APIToken'
      // const response = await request.put(
      //   `/1/checklists/${createdChecklistId}/name`,
      //   { headers, params, data },
      // );
      const response = await request.put(updateChecklistNameUrl, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      const { id: actualChecklistId, name: actualChecklistName } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualChecklistId).toContain(createdChecklistId);
      expect(actualChecklistName).toContain(expectedChecklistName);
      checklistDataForVerification = expectedChecklistName;
    });
    await test.step('3.2 Should Get a checklist name only', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const getChecklistNameOnly = generatePathURLSimplified(
        pathParameters.checklistParameter,
        createdChecklistId,
        'name',
      );

      // Act: 'https://api.trello.com/1/checklists/{id}/{field}?key=APIKey&token=APIToken'
      // const response = await request.get(
      //   `/1/checklists/${createdChecklistId}/name`,
      //   { headers, params },
      // );
      const response = await request.get(getChecklistNameOnly, {
        headers,
        params,
      });
      const responseJSON = await response.json();
      const { _value: actualChecklistName } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualChecklistName).toContain(checklistDataForVerification);
    });
  });

  test('4. Delete checklist and verify success', async ({ request }) => {
    await test.step('4.1 Should delete a checklist', async () => {
      //Arrange:
      const expectedStatusCode = 200;
      const expectedResponseObject = {};
      const deleteChecklistUrl = generatePathURLSimplified(
        pathParameters.checklistParameter,
        createdChecklistId,
      );

      // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
      // const response = await request.delete(
      //   `/1/checklists/${createdChecklistId}`,
      //   { headers, params },
      // );
      const response = await request.delete(deleteChecklistUrl, {
        headers,
        params,
      });
      const responseJSON = await response.json();
      const { limits: actualChecklistObject } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualChecklistObject).toEqual(expectedResponseObject);
    });
    await test.step('4.2 (NP) Should NOT get deleted checklist', async () => {
      // Arrange:
      const expectedStatusCode = 404;
      const expectedStatusText = 'Not Found';
      const getDeletedChecklistUrl = generatePathURLSimplified(
        pathParameters.checklistParameter,
        createdChecklistId,
      );

      // Act: 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken'
      // const response = await request.delete(
      //   `/1/checklists/${createdChecklistId}`,
      //   { headers, params },
      // );
      const response = await request.delete(getDeletedChecklistUrl, {
        headers,
        params,
      });

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toEqual(expectedStatusText);
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
