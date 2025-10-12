import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For Refactoring
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Boards handling - simplified factories', () => {
  let createdBoardId: string;
  let boardName: string;
  let boardDescription: string | undefined;

  test.beforeAll('Board preparation', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;

    const data: BoardDataModel = prepareRandomBoardDataSimplified();
    // console.log(data);

    // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
    const response = await request.post(`/1/boards`, { headers, params, data });
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdBoardId = responseJSON.id;
    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    const actualBoardName = responseJSON.name;
    expect(actualBoardName).toContain(data.name);
    const actualBoardDescription = responseJSON.desc;
    expect(actualBoardDescription).toContain(data.desc);
    // Add name of board to variable
    boardName = actualBoardName;
    boardDescription = data.desc;
  });
  test('1. Should get a board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.get(`/1/boards/${createdBoardId}`, {
      headers,
      params,
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);

    const actualBoardId = responseJSON.id;
    expect(actualBoardId).toContain(createdBoardId);
    const actualBoardName = responseJSON.name;
    expect(actualBoardName).toContain(boardName);
    const actualBoardDescription = responseJSON.desc;
    expect(actualBoardDescription).toContain(boardDescription);
  });

  test('2. Update and verification of updated Board fields', async ({
    request,
  }) => {
    const updatedBoardData =
      await test.step('2.1 Should update a board', async () => {
        // Arrange:
        const expectedBoardId = createdBoardId;
        const expectedStatusCode = 200;

        const data: BoardDataModel = prepareRandomBoardDataSimplified(
          'Updated Board name',
          true,
          4,
          'Updated Board description',
          true,
          5,
        );
        // console.log(data);

        // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
        const response = await request.put(`/1/boards/${expectedBoardId}`, {
          headers,
          params,
          data,
        });
        const responseJSON = await response.json();
        // console.log(responseJSON);

        // Assert:
        expect(response.status()).toEqual(expectedStatusCode);

        const actualBoardId = responseJSON.id;
        expect(actualBoardId).toContain(expectedBoardId);
        const actualBoardName = responseJSON.name;
        expect(actualBoardName).toContain(data.name);
        const actualBoardDescription = responseJSON.desc;
        expect(actualBoardDescription).toContain(data.desc);
        // Add name of board to variable
        return data;
      });
    await test.step('2.2 Should get a field from board', async () => {
      // Arrange:
      const expectedStatusCode = 200;

      // Act: 'https://api.trello.com/1/boards/{id}/{field}?key=APIKey&token=APIToken'
      const response = await request.get(`/1/boards/${createdBoardId}/name`, {
        headers,
        params,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);

      const actualBoardName = responseJSON._value;
      expect(actualBoardName).toContain(updatedBoardData.name);
    });
  });

  test('3. Delete a board and verify success', async ({ request }) => {
    await test.step('3.1 Should Delete a board', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const expectedResponseValue = null;

      // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
      const response = await request.delete(`/1/boards/${createdBoardId}`, {
        headers,
        params,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);

      const actualResponseValue = responseJSON._value;
      expect(actualResponseValue).toEqual(expectedResponseValue);
    });
    await test.step('3.2 (NP) Should NOT get a deleted board', async () => {
      // Arrange:
      const expectedStatusCode = 404;
      const expectedStatusText = 'Not Found';

      // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
      const response = await request.get(`/1/boards/${createdBoardId}`, {
        headers,
        params,
      });
      // console.log(response);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toContain(expectedStatusText);
    });
  });
  test('4. (NP) Should Not get board when unauthorized user', async ({
    request,
  }) => {
    // Arrange:
    const expectedStatusCode = 401;
    const expectedStatusText = 'Unauthorized';

    const incorrectParams: ParamsDataModel = prepareParamsDataSimplified(
      '',
      'sifnagehehwe',
    );
    // console.log(incorrectParams);

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    const response = await request.get(`/1/boards/${createdBoardId}`, {
      headers,
      params: { ...params, ...incorrectParams },
    });
    // console.log(response);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(response.statusText()).toContain(expectedStatusText);
  });

  test.afterAll('Delete a board', async ({ request }) => {
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(`/1/boards/${createdBoardId}`, {
      headers,
      params,
    });
  });
});
