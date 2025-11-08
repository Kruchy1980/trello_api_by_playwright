import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomListDataSimplified } from '@_src/API/factories/simplified_factories/list-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { ListDataModel } from '@_src/API/models/list-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { BoardRequest } from '@_src/API/requests/boardRequest';
import { ListRequest } from '@_src/API/requests/listRequest';
import { headers, params } from '@_src/API/utils/api_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Implement RUSO (Request Unit/Utility/ Service Objects)
// TODO: Improve to ROP (Request Object Model)

test.describe('Lists handling - RUSO implemented', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let data: ListDataModel;
  test.beforeAll('Board preparation', async ({ request }) => {
    const boardRequest = new BoardRequest(request);
    // // Path params generator usage
    // const createBoardUrl = generatePathURLSimplified(
    //   pathParameters.boardParameter,
    // );
    // RUSO usage
    const createBoardUrl = boardRequest.buildUrl();

    const data: BoardDataModel = prepareRandomBoardDataSimplified(
      'New Board',
      true,
      undefined,
      '',
    );

    // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
    // // Path params generator usage
    //     const response = await request.post(createBoardUrl, {
    //       headers,
    //       params,
    //       data,
    //     });
    // RUSO usage
    const response = await boardRequest.sendRequest('post', createBoardUrl, {
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
      const listRequest = new ListRequest(request);
      const boardRequest = new BoardRequest(request);
      const expectedStatusCode = 200;
      // // Path params generator usage
      // const createListUrl = generatePathURLSimplified(
      //   pathParameters.listParameter,
      // );
      // RUSO usage
      const createListUrl = listRequest.buildUrl();

      const data: ListDataModel = prepareRandomListDataSimplified(
        createdBoardId,
        'List Name',
        'top',
      );
      const { name: expectedListName } = data;

      // Act: 'https://api.trello.com/1/lists?name={name}&idBoard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      // // Path params generator usage
      // const response = await request.post(createListUrl, {
      //   headers,
      //   params,
      //   data,
      // });
      // RUSO usage
      const response = await listRequest.sendRequest('post', createListUrl, {
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
      // // Path params generator usage
      // const collectListsFromBoardUrl = generatePathURLSimplified(
      //   pathParameters.boardParameter,
      //   createdBoardId,
      //   'lists',
      // );
      // RUSO usage
      const collectListsFromBoardUrl = boardRequest.buildUrl(
        createdBoardId,
        'lists',
      );

      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      // // Path params generator usage
      // const responseGetListsIds = await request.get(collectListsFromBoardUrl, {
      //   headers,
      //   params,
      // });
      // RUSO usage
      const responseGetListsIds = await boardRequest.sendRequest(
        'get',
        collectListsFromBoardUrl,
        {
          headers,
          params,
        },
      );
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
    const listRequest = new ListRequest(request);
    await test.step('1.1 Should update list field', async () => {
      // Arrange:
      const listForUpdateId = createdListsIds[1];
      const expectedStatusCode = 200;
      // // Path params generator usage
      // const updateListFieldUrl = generatePathURLSimplified(
      //   pathParameters.listParameter,
      //   listForUpdateId,
      // );
      // RUSO usage
      const updateListFieldUrl = listRequest.buildUrl(listForUpdateId);
      data = prepareRandomListDataSimplified(undefined, '');
      const { name: expectedUpdatedListName } = data;

      // Act: ('https://api.trello.com/1/lists/{id}/{field}?key=APIKey&token=APIToken' <-- incorrect url no {field in path parameter}
      // //Path params generator usage
      // const response = await request.put(updateListFieldUrl, {
      //   headers,
      //   params,
      //   data,
      // });
      //RUSO usage
      const response = await listRequest.sendRequest(
        'put',
        updateListFieldUrl,
        {
          headers,
          params,
          data,
        },
      );
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
      // // Path params generator usage
      // const getListFieldUrl = generatePathURLSimplified(
      //   pathParameters.listParameter,
      //   updatedListId,
      // );
      // Path params generator usage
      const getListFieldUrl = listRequest.buildUrl(updatedListId);

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
      // // Path params generator usage
      // const response = await request.get(getListFieldUrl, {
      //   headers,
      //   params: { ...params, ...getFieldParams },
      // });
      // Path params generator usage
      const response = await listRequest.sendRequest('get', getListFieldUrl, {
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
    const listRequest = new ListRequest(request);
    await test.step('2.1 Should Archive a list', async () => {
      // Arrange:
      const listForArchiveId = createdListsIds[2];
      const expectedStatusCode = 200;
      // // Path params generator usage
      // const archiveListUrl = generatePathURLSimplified(
      //   pathParameters.listParameter,
      //   listForArchiveId,
      // );
      // RUSO usage
      const archiveListUrl = listRequest.buildUrl(listForArchiveId);

      const data: ListDataModel = prepareRandomListDataSimplified(
        undefined,
        undefined,
        undefined,
        true,
      );
      const { closed: expectedListStatus } = data;

      // Act: 'https://api.trello.com/1/lists/{id}/closed?key=APIKey&token=APIToken'
      // // Path params generator usage
      // const response = await request.put(archiveListUrl, {
      //   headers,
      //   params,
      //   data,
      // });
      // RUSO usage
      const response = await listRequest.sendRequest('put', archiveListUrl, {
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
      // // Path params generator usage
      // const collectArchivedListUrl = generatePathURLSimplified(
      //   pathParameters.listParameter,
      //   listForArchiveId,
      // );
      // Path params generator usage
      const collectArchivedListUrl = listRequest.buildUrl(listForArchiveId);

      // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
      // // Path params generator usage
      // const response = await request.get(collectArchivedListUrl, {
      //   headers,
      //   params,
      // });
      // RUSO usage
      const response = await listRequest.sendRequest(
        'get',
        collectArchivedListUrl,
        {
          headers,
          params,
        },
      );
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
    const listRequest = new ListRequest(request);
    const listForUpdateId = createdListsIds[createdListsIds.length - 1];
    const expectedStatusCode = 200;
    // // Path params generator usage
    // const updateListFieldsUrl = generatePathURLSimplified(
    //   pathParameters.listParameter,
    //   listForUpdateId,
    // );
    // RUSO usage
    const updateListFieldsUrl = listRequest.buildUrl(listForUpdateId);

    const data: ListDataModel = prepareRandomListDataSimplified(
      undefined,
      'Updated:',
      'top',
    );
    const { name: expectedListNameAfterUpdate } = data;

    // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
    // // Path params generator usage
    // const response = await request.put(updateListFieldsUrl, {
    //   headers,
    //   params,
    //   data,
    // });
    // RUSO usage
    const response = await listRequest.sendRequest('put', updateListFieldsUrl, {
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
    // Arrange:
    const boardRequest = new BoardRequest(request);
    // Path parameters usage only
    // const deleteBoardUrl = generatePathURLSimplified(
    //   pathParameters.boardParameter,
    //   createdBoardId,
    // );
    // RUSO usage
    const deleteBoardUrl = boardRequest.buildUrl(createdBoardId);
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    // // Path Params usage only
    // await request.delete(deleteBoardUrl, {
    //   headers,
    //   params,
    // });
    // RUSO usage
    await boardRequest.sendRequest('delete', deleteBoardUrl, {
      headers,
      params,
    });
  });
});
