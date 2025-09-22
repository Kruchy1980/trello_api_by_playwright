import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomListDataSimplified } from '@_src/API/factories/simplified_factories/list-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { ListDataModel } from '@_src/API/models/list-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Improve tests by destructuring objects
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Lists handling - destructured', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let data: ListDataModel;
  test.beforeAll('Board preparation', async ({ request }) => {
    const data: BoardDataModel = prepareRandomBoardDataSimplified(
      'New Board',
      true,
      undefined,
      '',
    );
    // console.log(data);

    // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
    const response = await request.post(`/1/boards`, { headers, params, data });
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // Destructuring responseJSON object
    const { id: actualBoardId } = responseJSON;
    // Before destructuring
    // createdBoardId = responseJSON.id;
    // After destructuring
    createdBoardId = actualBoardId;
  });

  test.beforeEach(
    'Create new list and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const expectedStatusCode = 200;

      const data: ListDataModel = prepareRandomListDataSimplified(
        createdBoardId,
        'List Name',
        'top',
      );
      // console.log('Create:', data);
      // Destructuring data object
      const { name: expectedListName } = data;

      // Act: 'https://api.trello.com/1/lists?name={name}&idBoard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      const response = await request.post(`/1/lists`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);
      // Destructuring responseJSON object
      const { name: actualListName } = responseJSON;

      // Assert:
      // Before destructing
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualListName = responseJSON.name;
      // expect(actualListName).toContain(data.name);
      // After destructing
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualListName = responseJSON.name;
      expect(actualListName).toContain(expectedListName);

      // Collect lists ids and push to variable
      // Arrange:
      const expectedListsQuantity = 0;

      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      const responseGetListsIds = await request.get(
        `/1/boards/${createdBoardId}/lists`,
        {
          headers,
          params,
        },
      );
      const responseGetListsIdsJSON = await responseGetListsIds.json();
      // console.log('Collecting Lists Ids', responseListsIdsJSON);
      // Before destructuring
      // responseListsIdsJSON.forEach((listId: { id: string }) => {
      //   createdListsIds.push(listId.id);
      // After destructuring - destructure inside loop
      responseGetListsIdsJSON.forEach(({ id }: { id: string }) => {
        createdListsIds.push(id);
      });

      // Assert: - no possible to destructuring object to verify its elements quantity
      // no destructuring needed for that assertion
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
      data = prepareRandomListDataSimplified(undefined, '');
      // console.log('Update:', data);
      // Destructuring data object
      const { name: expectedUpdatedListName } = data;

      // Act: ('https://api.trello.com/1/lists/{id}/{field}?key=APIKey&token=APIToken'
      const response = await request.put(`/1/lists/${listForUpdateId}`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);
      // Destructuring responseJSON object
      const { id: actualListId, name: actualListName } = responseJSON;

      // Assert:
      // Before destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualListId = responseJSON.id;
      // expect(actualListId).toContain(listForUpdateId);
      // const actualListName = responseJSON.name;
      // expect(actualListName).toContain(data.name);
      // After destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualListId = responseJSON.id;
      expect(actualListId).toContain(listForUpdateId);
      // const actualListName = responseJSON.name;
      expect(actualListName).toContain(expectedUpdatedListName);
    });
    await test.step('1.2 Should get a list field', async () => {
      // Arrange:
      const updatedListId = createdListsIds[1];
      const expectedStatusCode = 200;

      const getFieldParams: ParamsDataModel = prepareParamsDataSimplified(
        '',
        '',
        '',
        undefined,
        false,
        '',
        'name',
      );
      // console.log(getFieldParams);
      // Destructuring globally/script visible data object
      const { name: expectedUpdatedListName } = data;

      // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
      const response = await request.get(`/1/lists/${updatedListId}`, {
        headers,
        params: { ...params, ...getFieldParams },
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);
      // Destructuring responseJSON object
      const { id: actualListId, name: actualListName } = responseJSON;

      // Assert:
      // Before destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualListId = responseJSON.id;
      // expect(actualListId).toContain(updatedListId);
      // const actualListName = responseJSON.name;
      // expect(actualListName).toContain(data.name);
      // After destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualListId = responseJSON.id;
      expect(actualListId).toContain(updatedListId);
      // const actualListName = responseJSON.name;
      expect(actualListName).toContain(expectedUpdatedListName);
    });
  });
  test('2. Archive list and verify whether exists', async ({ request }) => {
    await test.step('2.1 Should Archive a list', async () => {
      // Arrange:
      const listForArchiveId = createdListsIds[2];
      const expectedStatusCode = 200;

      // const data: ListDataModel = {
      //   closed: true,
      // };
      const data: ListDataModel = prepareRandomListDataSimplified(
        undefined,
        undefined,
        undefined,
        true,
      );
      // console.log(data);
      // Destructuring data object
      const { closed: expectedListStatus } = data;

      // Act: 'https://api.trello.com/1/lists/{id}/closed?key=APIKey&token=APIToken'
      const response = await request.put(`/1/lists/${listForArchiveId}`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);
      // Destructuring responseJSON object
      const { id: actualListId, closed: actualListStatus } = responseJSON;

      // Assert:
      // // Before destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualListId = responseJSON.id;
      // expect(actualListId).toEqual(listForArchiveId);
      // const actualListStatus = responseJSON.closed;
      // expect(actualListStatus).toEqual(data.closed);
      // After destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualListId = responseJSON.id;
      expect(actualListId).toEqual(listForArchiveId);
      // const actualListStatus = responseJSON.closed;
      expect(actualListStatus).toEqual(expectedListStatus);
    });
    await test.step('2.2 Should get archived list', async () => {
      // Arrange:
      const listForArchiveId = createdListsIds[2];
      const expectedStatusCode = 200;
      const expectedListStatus = true;
      const expectedListName = 'Doing';

      // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
      const response = await request.get(`/1/lists/${listForArchiveId}`, {
        headers,
        params,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);
      // Destructuring responseJSON object
      const {
        id: actualListId,
        closed: actualListStatus,
        name: actualListName,
      } = responseJSON;

      // Assert:
      // // Before destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualListId = responseJSON.id;
      // expect(actualListId).toEqual(listForArchiveId);
      // const actualListStatus = responseJSON.closed;
      // expect(actualListStatus).toEqual(expectedListStatus);
      // const actualListName = responseJSON.name;
      // expect(actualListName).toEqual(expectedListName);
      // Before destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualListId = responseJSON.id;
      expect(actualListId).toEqual(listForArchiveId);
      // const actualListStatus = responseJSON.closed;
      expect(actualListStatus).toEqual(expectedListStatus);
      // const actualListName = responseJSON.name;
      expect(actualListName).toEqual(expectedListName);
    });
  });

  test('3. Should update a list fields', async ({ request }) => {
    // Arrange:
    const listForUpdateId = createdListsIds[createdListsIds.length - 1];
    const expectedStatusCode = 200;

    const data: ListDataModel = prepareRandomListDataSimplified(
      undefined,
      'Updated:',
      'top',
    );
    // console.log('update:', data);
    // Destructuring data object
    const { name: expectedListNameAfterUpdate } = data;

    // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
    const response = await request.put(`/1/lists/${listForUpdateId}`, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // Destructuuring responseJSON object
    const { id: actualListId, name: actualListName } = responseJSON;

    // Assert:
    // // Before Destructuring
    // expect(response.status()).toEqual(expectedStatusCode);
    // const actualListId = responseJSON.id;
    // expect(actualListId).toEqual(listForUpdateId);
    // const actualListName = responseJSON.name;
    // expect(actualListName).toEqual(data.name);
    // After Destructuring
    expect(response.status()).toEqual(expectedStatusCode);
    // const actualListId = responseJSON.id;
    expect(actualListId).toEqual(listForUpdateId);
    // const actualListName = responseJSON.name;
    expect(actualListName).toEqual(expectedListNameAfterUpdate);
  });
  test.afterAll('Delete a board', async ({ request }) => {
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
  });
});
