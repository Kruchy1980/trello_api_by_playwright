import { ParamsDataModel } from '@_src/API/models//params-data.model';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For Refactoring
// TODO: Prepare models for data generation
// TODO: Prepare factories for models handling
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Boards handling - models prep and implemeted', () => {
  let createdBoardId: string;
  let boarName: string;

  test.beforeAll('Board preparation', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;

    const data: BoardDataModel = {
      name: 'My first Board name',
      desc: 'My first Board description',
    };

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
    boarName = actualBoardName;
  });
  test('1. Should get a board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedBoardName = boarName;
    const expectedBoardDescription = 'My first Board description';

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
    expect(actualBoardName).toContain(expectedBoardName);
    const actualBoardDescription = responseJSON.desc;
    expect(actualBoardDescription).toContain(expectedBoardDescription);
  });
  test('2. Should update a board', async ({ request }) => {
    // Arrange:
    const expectedBoardId = createdBoardId;
    const expectedStatusCode = 200;

    const data: BoardDataModel = {
      name: 'Updated Board name',
      desc: 'Updated Board description',
    };

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
    boarName = actualBoardName;
  });
  test('3. Should get a field from board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const updatedBoardName = boarName;

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
    expect(actualBoardName).toContain(updatedBoardName);
  });

  test('4. Delete a board and verify success', async ({ request }) => {
    await test.step('4.1 Should Delete a board', async () => {
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
    await test.step('4.2 (NP) Should NOT get a deleted board', async () => {
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
  test('5. (NP) Should Not get board when unauthorized user', async ({
    request,
  }) => {
    // Arrange:
    const expectedStatusCode = 401;
    const expectedStatusText = 'Unauthorized';
    const incorrectParams: ParamsDataModel = {
      key: 'poisfbnzpoib',
      token: params.token,
    };

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
