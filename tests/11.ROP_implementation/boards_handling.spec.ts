import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { asRecord } from '@_src/API/helpers/conversion_helpers/convert_as_record';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { BoardRequest } from '@_src/API/requests/for_ROP_Requests/boardRequest';

import { headers, params } from '@_src/API/utils/api_utils';

import { expect, test } from '@playwright/test';

// TODO: For Refactoring
// TODO: Improve to ROP (Request Object Pattern)

test.describe('Boards handling - RU_SO implemented', () => {
  let createdBoardId: string;
  let boardName: string | undefined;
  let boardDescription: string | undefined;

  test.beforeAll('Board preparation', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const boardRequest = new BoardRequest(request);
    // RUSO Usage
    // const boardPathURL = boardRequest.buildUrl();
    // console.log('Prepared path parameter', boardPathURL);

    const data: BoardDataModel = prepareRandomBoardDataSimplified();
    const { name: expectedBoardName, desc: expectedBoardDescription } = data;

    // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'

    // // RUSO Usage
    // const response = await boardRequest.sendRequest('post', boardPathURL, {
    //   headers,
    //   params,
    //   data,
    // });

    // ROP Usage
    const response = await boardRequest.createBoard(data, params, headers);

    // console.log(response.url());
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
    const boardRequest = new BoardRequest(request);
    const expectedStatusCode = 200;
    // RUSO Usage
    // const getBoardURL = boardRequest.buildUrl(createdBoardId);
    // console.log('Path Param added to url', getBoardURL);

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'

    // New implementation with RUSO usage
    // const response = await boardRequest.sendRequest('get', getBoardURL, {
    //   headers,
    //   params,
    // });

    // ROP Usage
    const response = await boardRequest.getBoard(
      createdBoardId,
      params,
      headers,
    );
    // console.log(response.url());
    const responseJSON = await response.json();
    // console.log(responseJSON);
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
    const boardRequest = new BoardRequest(request);
    const updatedBoardData =
      await test.step('2.1 Should update a board', async () => {
        // Arrange:
        const expectedBoardId = createdBoardId;
        const expectedStatusCode = 200;
        // RUSO usage
        // const updateBoardUrl = boardRequest.buildUrl(expectedBoardId);

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
        // // RUSO Usage
        // const response = await boardRequest.sendRequest('PUT', updateBoardUrl, {
        //   headers,
        //   params,
        //   data,
        // });
        // ROP Usage
        const response = await boardRequest.updateBoard(
          createdBoardId,
          data,
          params,
          headers,
        );
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
      // RUSO usage
      // const getFieldFromBoardUrl = boardRequest.buildUrl(
      //   createdBoardId,
      //   'name',
      // );
      // console.log('Simplified parameterGenerator', getFieldFromBoardUrl);

      // Act: 'https://api.trello.com/1/boards/{id}/{field}?key=APIKey&token=APIToken'
      // RUSO Usage
      const response = await boardRequest.getBoardElements(
        createdBoardId,
        'name',
        params,
        headers,
      );

      const responseJSON = await response.json();
      const { _value: actualBoardName } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualBoardName).toContain(updatedBoardData);
    });
  });

  test('3. Delete a board and verify success', async ({ request }) => {
    const boardRequest = new BoardRequest(request);
    await test.step('3.1 Should Delete a board', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const expectedResponseValue = null;
      // RUSO Usage
      // const deleteBoardURL = boardRequest.buildUrl(createdBoardId);

      // // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
      // // RUSO Usage
      // const response = await boardRequest.sendRequest(
      //   'delete',
      //   deleteBoardURL,
      //   {
      //     headers,
      //     params,
      //   },
      // );
      // ROP Usage
      const response = await boardRequest.deleteBoard(
        createdBoardId,
        params,
        headers,
      );
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
      // RUSO Usage
      // const getDeletedBoardUrl = boardRequest.buildUrl(createdBoardId);

      // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
      // RUSO Usage
      const response = await boardRequest.getBoard(
        createdBoardId,
        headers,
        params,
      );

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toContain(expectedStatusText);
    });
  });
  test('4. (NP) Should Not get board when unauthorized user', async ({
    request,
  }) => {
    // Arrange:
    const boardRequest = new BoardRequest(request);
    const expectedStatusCode = 401;
    const expectedStatusText = 'Unauthorized';
    // RUSO Usage
    // const unauthorizedUserUrL = boardRequest.buildUrl(createdBoardId);
    // console.log(unauthorizedUserUrL);

    const incorrectParams: ParamsDataModel = prepareParamsDataSimplified(
      '',
      'sifnagehehwe',
    );

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    // // RUSO Usage
    // const response = await boardRequest.sendRequest(
    //   'get',
    //   unauthorizedUserUrL,
    //   {
    //     params: { ...incorrectParams },
    //   },
    // );
    // ROP Usage
    const response = await boardRequest.getBoard(
      createdBoardId,
      asRecord(incorrectParams),
      headers,
    );
    // console.log(response.url());

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(response.statusText()).toContain(expectedStatusText);
  });

  test.afterAll('Delete a board', async ({ request }) => {
    // Arrange:
    const boardRequest = new BoardRequest(request);
    // RUSO usage
    // const deleteBoardUrl = boardRequest.buildUrl(createdBoardId);
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'

    // // RUSO usage
    // await boardRequest.sendRequest('delete', deleteBoardUrl, {
    //   headers,
    //   params,
    // });
    // ROP usage
    await boardRequest.deleteBoard(createdBoardId, params, headers);
  });
});
