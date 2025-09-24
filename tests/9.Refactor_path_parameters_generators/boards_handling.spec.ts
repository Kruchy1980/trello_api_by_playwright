import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { generatePathURLSimplified } from '@_src/API/helpers/path_params_generators/path_params_simplified_generator/simplified_path_parameters_generator';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { pathParameters } from '@_src/API/utils/path_parameters_utils';

import { expect, test } from '@playwright/test';

// TODO: For Refactoring
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Boards handling - path_generators', () => {
  let createdBoardId: string;
  let boardName: string | undefined;
  let boardDescription: string | undefined;

  test.beforeAll('Board preparation', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const boardPathURL = generatePathURLSimplified(
      pathParameters.boardParameter,
    );
    // console.log('Prepared path parameter', boardPathURL);

    const data: BoardDataModel = prepareRandomBoardDataSimplified();

    const { name: expectedBoardName, desc: expectedBoardDescription } = data;

    // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
    // const response = await request.post(`/1/boards`, { headers, params, data });
    const response = await request.post(boardPathURL, {
      headers,
      params,
      data,
    });

    const responseJSON = await response.json();

    const {
      id: actualBoardId,
      name: actualBoardName,
      desc: actualBoardDescription,
    } = responseJSON;

    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    expect(actualBoardName).toContain(expectedBoardName);
    expect(actualBoardDescription).toContain(expectedBoardDescription);
    createdBoardId = actualBoardId;
    boardName = expectedBoardName;
    boardDescription = expectedBoardDescription;
  });
  test('1. Should get a board', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const getBoardURL = generatePathURLSimplified(
      pathParameters.boardParameter,
      createdBoardId,
    );
    // console.log('Path Param added to url', getBoardURL);

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    // const response = await request.get(`/1/boards/${createdBoardId}`, {
    //   headers,
    //   params,
    // });
    const response = await request.get(getBoardURL, {
      headers,
      params,
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // Destructuring
    const {
      id: actualBoardId,
      name: actualBoardName,
      desc: actualBoardDescription,
    } = responseJSON;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(actualBoardId).toContain(createdBoardId);
    expect(actualBoardName).toContain(boardName);
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
        const updateBoardUrl = generatePathURLSimplified(
          pathParameters.boardParameter,
          expectedBoardId,
        );

        const data: BoardDataModel = prepareRandomBoardDataSimplified(
          'Updated Board name',
          true,
          4,
          'Updated Board description',
          true,
          5,
        );
        const { name: expectedBoardName, desc: expectedBoardDescription } =
          data;

        // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
        // const response = await request.put(`/1/boards/${expectedBoardId}`, {
        //   headers,
        //   params,
        //   data,
        // });
        const response = await request.put(updateBoardUrl, {
          headers,
          params,
          data,
        });
        const responseJSON = await response.json();

        const {
          id: actualBoardId,
          name: actualBoardName,
          desc: actualBoardDescription,
        } = responseJSON;

        // Assert:
        expect(response.status()).toEqual(expectedStatusCode);
        expect(actualBoardId).toContain(expectedBoardId);
        expect(actualBoardName).toContain(expectedBoardName);
        expect(actualBoardDescription).toContain(expectedBoardDescription);

        return expectedBoardName;
      });
    await test.step('2.2 Should get a field from board', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const getFieldFromBoardUrl = generatePathURLSimplified(
        pathParameters.boardParameter,
        createdBoardId,
        'name',
      );
      // console.log('Simplified parameterGenerator', getFieldFromBoardUrl);

      // Act: 'https://api.trello.com/1/boards/{id}/{field}?key=APIKey&token=APIToken'
      // const response = await request.get(`/1/boards/${createdBoardId}/name`, {
      //   headers,
      //   params,
      // });
      const response = await request.get(getFieldFromBoardUrl, {
        headers,
        params,
      });

      const responseJSON = await response.json();
      const { _value: actualBoardName } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualBoardName).toContain(updatedBoardData);
    });
  });

  test('3. Delete a board and verify success', async ({ request }) => {
    await test.step('3.1 Should Delete a board', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const expectedResponseValue = null;
      const deleteBoardURL = generatePathURLSimplified(
        pathParameters.boardParameter,
        createdBoardId,
      );

      // // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
      // const response = await request.delete(`/1/boards/${createdBoardId}`, {
      //   headers,
      //   params,
      // });

      const response = await request.delete(deleteBoardURL, {
        headers,
        params,
      });
      const responseJSON = await response.json();
      const { _value: actualResponseValue } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualResponseValue).toEqual(expectedResponseValue);
    });
    await test.step('3.2 (NP) Should NOT get a deleted board', async () => {
      // Arrange:
      const expectedStatusCode = 404;
      const expectedStatusText = 'Not Found';
      const getDeletedBoardUrl = generatePathURLSimplified(
        pathParameters.boardParameter,
        createdBoardId,
      );

      // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
      // const response = await request.get(`/1/boards/${createdBoardId}`, {
      //   headers,
      //   params,
      // });
      const response = await request.get(getDeletedBoardUrl, {
        headers,
        params,
      });

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
    const unauthorizedUserUrL = generatePathURLSimplified(
      pathParameters.boardParameter,
      createdBoardId,
    );

    const incorrectParams: ParamsDataModel = prepareParamsDataSimplified(
      '',
      'sifnagehehwe',
    );

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    // const response = await request.get(`/1/boards/${createdBoardId}`, {
    //   headers,
    //   params: { ...params, ...incorrectParams },
    // });
    const response = await request.get(unauthorizedUserUrL, {
      headers,
      params: { ...params, ...incorrectParams },
    });

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(response.statusText()).toContain(expectedStatusText);
  });

  test.afterAll('Delete a board', async ({ request }) => {
    const deleteBoardUrl = generatePathURLSimplified(
      pathParameters.boardParameter,
      createdBoardId,
    );
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    // await request.delete(`/1/boards/${createdBoardId}`, {
    //   headers,
    //   params,
    // });
    await request.delete(deleteBoardUrl, {
      headers,
      params,
    });
  });
});
