import { prepareRandomBoardData } from '@_src/API/factories/board-data.factory';
import { prepareRandomListData } from '@_src/API/factories/list-data.factory';
import { prepareParamsData } from '@_src/API/factories/params-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { ListDataModel } from '@_src/API/models/list-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Prepare factories for models handling
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Lists handling - factories implementation', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let data: ListDataModel;
  test.beforeAll('Board preparation', async ({ request }) => {
    // Arrange:
    // const data: BoardDataModel = {
    //   name: `My Board - ${new Date().toISOString().split('T')[1].split('Z')[0]}`,
    // };
    const data: BoardDataModel = prepareRandomBoardData(
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
    createdBoardId = responseJSON.id;
  });

  test.beforeEach(
    'Create new list and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const expectedStatusCode = 200;
      // const data: ListDataModel = {
      //   name: 'My first list name',
      //   pos: 'top',
      //   idBoard: createdBoardId,
      // };
      const data: ListDataModel = prepareRandomListData(
        createdBoardId,
        'List Name',
        'top',
      );
      // console.log('Create:', data);

      // Act: 'https://api.trello.com/1/lists?name={name}&idBoard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      const response = await request.post(`/1/lists`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualListName = responseJSON.name;
      expect(actualListName).toContain(data.name);

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
      // console.log(responseJSON);
      responseGetListsIdsJSON.forEach((listId: { id: string }) => {
        createdListsIds.push(listId.id);
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
      data = prepareRandomListData(undefined, '');
      // console.log('Update:', data);

      // Act: ('https://api.trello.com/1/lists/{id}/{field}?key=APIKey&token=APIToken'
      const response = await request.put(`/1/lists/${listForUpdateId}`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualListId = responseJSON.id;
      expect(actualListId).toContain(listForUpdateId);
      const actualListName = responseJSON.name;
      expect(actualListName).toContain(data.name);
    });
    await test.step('1.2 Should get a list field', async () => {
      // Arrange:
      const updatedListId = createdListsIds[1];
      const expectedStatusCode = 200;

      // const getFieldParams: ParamsDataModel = {
      //   key: params.key,
      //   token: params.token,
      //   fields: 'name',
      // };
      const getFieldParams: ParamsDataModel = prepareParamsData(
        '',
        '',
        '',
        undefined,
        false,
        '',
        'name',
      );

      console.log(getFieldParams);

      // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
      const response = await request.get(`/1/lists/${updatedListId}`, {
        headers,
        params: { ...params, ...getFieldParams },
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualListId = responseJSON.id;
      expect(actualListId).toContain(updatedListId);
      const actualListName = responseJSON.name;
      expect(actualListName).toContain(data.name);
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
      const data: ListDataModel = prepareRandomListData(
        undefined,
        undefined,
        undefined,
        true,
      );
      // console.log(data);

      // console.log(
      //   '4 params',
      //   prepareRandomListData(createdBoardId, 'Name', 'top', true),
      // );
      // console.log(
      //   '3 params',
      //   prepareRandomListData(createdBoardId, 'Name', 'top', false),
      // );
      // console.log(
      //   '3 params',
      //   prepareRandomListData(createdBoardId, 'Name', 'top'),
      // );
      // console.log('2 params', prepareRandomListData(createdBoardId, 'Name'));
      // console.log('1 params', prepareRandomListData(undefined, 'Name'));
      // console.log('1 params', prepareRandomListData(undefined, undefined));
      // console.log('1 params', prepareRandomListData(undefined, ''));
      // console.log(
      //   '1 params',
      //   prepareRandomListData(undefined, undefined, undefined, true),
      // );

      // Act: 'https://api.trello.com/1/lists/{id}/closed?key=APIKey&token=APIToken'
      const response = await request.put(`/1/lists/${listForArchiveId}`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualListId = responseJSON.id;
      expect(actualListId).toEqual(listForArchiveId);
      const actualListStatus = responseJSON.closed;
      expect(actualListStatus).toEqual(data.closed);
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

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualListId = responseJSON.id;
      expect(actualListId).toEqual(listForArchiveId);
      const actualListStatus = responseJSON.closed;
      expect(actualListStatus).toEqual(expectedListStatus);
      const actualListName = responseJSON.name;
      expect(actualListName).toEqual(expectedListName);
    });
  });

  test('3. Should update a list fields', async ({ request }) => {
    // Arrange:
    const listForUpdateId = createdListsIds[createdListsIds.length - 1];
    const expectedStatusCode = 200;
    // const data: ListDataModel = {
    //   name: 'Tasks with the highest priority',
    //   pos: 'top',
    // };
    const data: ListDataModel = prepareRandomListData(
      undefined,
      'Updated:',
      'top',
    );
    // console.log('update:', data);

    // Act: 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken'
    const response = await request.put(`/1/lists/${listForUpdateId}`, {
      headers,
      params,
      data,
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualListId = responseJSON.id;
    expect(actualListId).toEqual(listForUpdateId);
    const actualListName = responseJSON.name;
    expect(actualListName).toEqual(data.name);
  });
  test.afterAll('Delete a board', async ({ request }) => {
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
  });
});
