import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomListDataSimplified } from '@_src/API/factories/simplified_factories/list-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { generatePathURLSimplified } from '@_src/API/helpers/path_params_generators/path_params_simplified_generator/simplified_path_parameters_generator';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { ListDataModel } from '@_src/API/models/list-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { pathParameters } from '@_src/API/utils/path_parameters_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Lists handling - path_generators', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let data: ListDataModel;
  test.beforeAll('Board preparation', async ({ request }) => {
    const createBoardUrl = generatePathURLSimplified(
      pathParameters.boardParameter,
    );
    const data: BoardDataModel = prepareRandomBoardDataSimplified(
      'New Board',
      true,
      undefined,
      '',
    );

    // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
    // const response = await request.post(`/1/boards`, { headers, params, data });
    const response = await request.post(createBoardUrl, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    const { id: actualBoardId } = responseJSON;

    createdBoardId = actualBoardId;
  });

  test.beforeEach(
    'Create new list and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const expectedStatusCode = 200;
      const createListUrl = generatePathURLSimplified(
        pathParameters.listParameter,
      );

      const data: ListDataModel = prepareRandomListDataSimplified(
        createdBoardId,
        'List Name',
        'top',
      );
      const { name: expectedListName } = data;

      // Act: 'https://api.trello.com/1/lists?name={name}&idBoard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      // const response = await request.post(`/1/lists`, {
      //   headers,
      //   params,
      //   data,
      // });
      const response = await request.post(createListUrl, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      const { name: actualListName } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualListName).toContain(expectedListName);

      // Collect lists ids and push to variable
      // Arrange:
      const expectedListsQuantity = 0;
      const collectListsFromBoardUrl = generatePathURLSimplified(
        pathParameters.boardParameter,
        createdBoardId,
        'lists',
      );

      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      // const responseGetListsIds = await request.get(
      //   `/1/boards/${createdBoardId}/lists`,
      //   {
      //     headers,
      //     params,
      //   },
      // );
      const responseGetListsIds = await request.get(collectListsFromBoardUrl, {
        headers,
        params,
      });
      const responseGetListsIdsJSON = await responseGetListsIds.json();
      responseGetListsIdsJSON.forEach(({ id }: { id: string }) => {
        createdListsIds.push(id);
      });

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualListQuantity = responseGetListsIdsJSON.length;
      expect(actualListQuantity).toBeGreaterThan(expectedListsQuantity);
    },
  );

  test('1. Update and verify proper list name', async ({ request }) => {
    await test.step('1.1 Should update list field', async () => {
      // Arrange:
      const listForUpdateId = createdListsIds[1];
      const expectedStatusCode = 200;
      const updateListFieldUrl = generatePathURLSimplified(
        pathParameters.listParameter,
        listForUpdateId,
      );
      data = prepareRandomListDataSimplified(undefined, '');
      const { name: expectedUpdatedListName } = data;

      // Act: ('https://api.trello.com/1/lists/{id}/{field}?key=APIKey&token=APIToken' <-- incrrect url no {field in path parameter}
      // const response = await request.put(`/1/lists/${listForUpdateId}`, {
      //   headers,
      //   params,
      //   data,
      // });
      const response = await request.put(updateListFieldUrl, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      const { id: actualListId, name: actualListName } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualListId).toContain(listForUpdateId);
      expect(actualListName).toContain(expectedUpdatedListName);
    });
    await test.step('1.2 Should get a list field', async () => {
      // Arrange:
      const updatedListId = createdListsIds[1];
      const expectedStatusCode = 200;
      const getListFieldUrl = generatePathURLSimplified(
        pathParameters.listParameter,
        updatedListId,
      );

      const getFieldParams: ParamsDataModel = prepareParamsDataSimplified(
        '',
        '',
        '',
        undefined,
        false,
        '',
        'name',
      );
      const { name: expectedUpdatedListName } = data;

      // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
      // const response = await request.get(`/1/lists/${updatedListId}`, {
      //   headers,
      //   params: { ...params, ...getFieldParams },
      // });
      const response = await request.get(getListFieldUrl, {
        headers,
        params: { ...params, ...getFieldParams },
      });
      const responseJSON = await response.json();
      const { id: actualListId, name: actualListName } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualListId).toContain(updatedListId);
      expect(actualListName).toContain(expectedUpdatedListName);
    });
  });
  test('2. Archive list and verify whether exists', async ({ request }) => {
    await test.step('2.1 Should Archive a list', async () => {
      // Arrange:
      const listForArchiveId = createdListsIds[2];
      const expectedStatusCode = 200;
      const archiveListUrl = generatePathURLSimplified(
        pathParameters.listParameter,
        listForArchiveId,
      );

      const data: ListDataModel = prepareRandomListDataSimplified(
        undefined,
        undefined,
        undefined,
        true,
      );
      const { closed: expectedListStatus } = data;

      // Act: 'https://api.trello.com/1/lists/{id}/closed?key=APIKey&token=APIToken' <-- incorrect URL in documentation -
      // no closed should be added in path params
      // const response = await request.put(`/1/lists/${listForArchiveId}`, {
      //   headers,
      //   params,
      //   data,
      // });
      const response = await request.put(archiveListUrl, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      const { id: actualListId, closed: actualListStatus } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualListId).toEqual(listForArchiveId);
      expect(actualListStatus).toEqual(expectedListStatus);
    });
    await test.step('2.2 Should get archived list', async () => {
      // Arrange:
      const listForArchiveId = createdListsIds[2];
      const expectedStatusCode = 200;
      const expectedListStatus = true;
      const expectedListName = 'Doing';
      const collectArchivedListUrl = generatePathURLSimplified(
        pathParameters.listParameter,
        listForArchiveId,
      );

      // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
      // const response = await request.get(`/1/lists/${listForArchiveId}`, {
      //   headers,
      //   params,
      // });
      const response = await request.get(collectArchivedListUrl, {
        headers,
        params,
      });
      const responseJSON = await response.json();
      const {
        id: actualListId,
        closed: actualListStatus,
        name: actualListName,
      } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualListId).toEqual(listForArchiveId);
      expect(actualListStatus).toEqual(expectedListStatus);
      expect(actualListName).toEqual(expectedListName);
    });
  });

  test('3. Should update a list fields', async ({ request }) => {
    // Arrange:
    const listForUpdateId = createdListsIds[createdListsIds.length - 1];
    const expectedStatusCode = 200;
    const updateListFieldsUrl = generatePathURLSimplified(
      pathParameters.listParameter,
      listForUpdateId,
    );

    const data: ListDataModel = prepareRandomListDataSimplified(
      undefined,
      'Updated:',
      'top',
    );
    const { name: expectedListNameAfterUpdate } = data;

    // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
    // const response = await request.put(`/1/lists/${listForUpdateId}`, {
    //   headers,
    //   params,
    //   data,
    // });
    const response = await request.put(updateListFieldsUrl, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    const { id: actualListId, name: actualListName } = responseJSON;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(actualListId).toEqual(listForUpdateId);
    expect(actualListName).toEqual(expectedListNameAfterUpdate);
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
