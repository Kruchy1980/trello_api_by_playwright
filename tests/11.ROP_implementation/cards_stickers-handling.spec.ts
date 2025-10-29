import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomStickerDataSimplified } from '@_src/API/factories/simplified_factories/card_stickers-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { asRecord } from '@_src/API/helpers/conversion_helpers/convert_as_record';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { CardStickerDataModel } from '@_src/API/models/card_stickers-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { BoardRequest } from '@_src/API/requests/for_ROP_Requests/boardRequest';
import { CardRequest } from '@_src/API/requests/for_ROP_Requests/cardRequest';
import { headers, params } from '@_src/API/utils/api_utils';

import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Improve to ROP (Request Object Pattern)

test.describe('Cards stickers handling - RU_SO implemented', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  const createdCardsIds: string[] = [];
  let createdStickersIds: string[] = [];
  let createdStickersNames: string[] = [];

  test.beforeAll(
    'Board, card preparation and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const boardRequest = new BoardRequest(request);
      // RUSO Usage
      // const boardURL = boardRequest.buildUrl();
      const data: BoardDataModel = prepareRandomBoardDataSimplified();

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      // RUSO usage
      const response = await boardRequest.createBoard(data, params, headers);
      const responseJSON = await response.json();
      const { id: actualBoardId } = responseJSON;
      createdBoardId = actualBoardId;

      // Collect lists Id's
      // Arrange:
      // RUSO usage
      // const getListsUrl = boardRequest.buildUrl(createdBoardId, 'lists');

      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      // // RUSO usage
      // const responseGetLists = await boardRequest.sendRequest(
      //   'get',
      //   boardURL,
      //   {
      //     headers,
      //     params,
      //     data,
      //   },
      // );
      // ROP usage
      const responseGetLists = await boardRequest.getBoardElements(
        createdBoardId,
        'lists',
        params,
        headers,
      );
      const responseGetListsJSON = await responseGetLists.json();
      responseGetListsJSON.forEach(({ id }: { id: string }) => {
        createdListsIds.push(id);
      });

      // Card Preparation
      const cardRequest = new CardRequest(request);
      for (let i = 0; i < 3; i++) {
        // Arrange:
        // RUSO usage
        // const cardCreationURL = cardRequest.buildUrl();
        const data: CardDataModel = prepareRandomCardDataSimplified(
          createdListsIds[i],
          'Card Name',
          undefined,
          undefined,
          undefined,
          true,
          i + 1,
        );

        // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
        // // ROP Usage
        // const response = await cardRequest.sendRequest(
        //   'post',
        //   cardCreationUrl,
        //   { headers, params, data },
        // );
        // ROP Usage
        const response = await cardRequest.createCard(data, params, headers);
        const responseJSON = await response.json();
        const { id: actualCardId } = responseJSON;
        createdCardsIds.push(actualCardId);
      }
    },
  );

  test.beforeEach('Add a sticker to a card', async ({ request }) => {
    for (let i = 0; i < 3; i++) {
      // Arrange:
      const cardRequest = new CardRequest(request);
      const expectedStatusCode = 200;
      // RUSO Usage
      // const addStickerURL = cardRequest.buildUrl(
      //   createdCardsIds[i],
      //   'stickers',
      // );
      const data: CardStickerDataModel = prepareRandomStickerDataSimplified(
        '',
        20.22,
        50.22,
        3,
      );
      const {
        image: expectedStickerName,
        top: expectedStickerFromTop,
        left: expectedStickerFromLeft,
        zIndex: expectedStickerOverlay,
      } = data;

      // Act: 'https://api.trello.com/1/cards/{id}/stickers?image={image}&top={top}&left={left}&zIndex={zIndex}&key=APIKey&token=APIToken'
      // // RUSO usage
      // const response = await cardRequest.sendRequest('post', addStickerURL, {
      //   headers,
      //   params,
      //   data,
      // });
      // ROP usage
      const response = await cardRequest.addStickerToCard(
        createdCardsIds[i],
        'stickers',
        data,
        params,
        headers,
      );
      const responseJSON = await response.json();
      const {
        id: actualStickerId,
        image: actualStickerName,
        top: actualStickerFromTop,
        left: actualStickerFromLeft,
        zIndex: actualStickerZIndex,
      } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualStickerName).toContain(expectedStickerName);
      expect(actualStickerFromTop).toEqual(expectedStickerFromTop);
      expect(actualStickerFromLeft).toEqual(expectedStickerFromLeft);
      expect(actualStickerZIndex).toEqual(expectedStickerOverlay);

      createdStickersIds.push(actualStickerId);
      createdStickersNames.push(actualStickerName);
    }
  });
  test('1. Update sticker field and verify success', async ({ request }) => {
    const cardRequest = new CardRequest(request);
    let dataForVerification: CardStickerDataModel;
    await test.step('1.1 Should update sticker on card', async () => {
      // Arrange:
      const cardId = createdCardsIds[1];
      const stickerId = createdStickersIds[1];
      const expectedStatusCode = 200;
      // RUSO usage
      // const updateStickerOnCardURL = cardRequest.buildUrl(
      //   cardId,
      //   'stickers',
      //   stickerId,
      // );
      const data: CardStickerDataModel = prepareRandomStickerDataSimplified(
        createdStickersNames[1],
        12,
        undefined,
        2,
        180,
      );
      const {
        image: expectedStickerName,
        top: expectedStickerFromTop,
        left: expectedStickerFromLeft,
        zIndex: expectedStickerOverlay,
        rotate: expectedStickerRotation,
      } = data;

      // Act: /1/cards/{id}/stickers/{idSticker}?top={top}&left={left}&zIndex={zIndex}
      // // RUSO usage
      // const response = await cardRequest.sendRequest(
      //   'put',
      //   updateStickerOnCardURL,
      //   {
      //     headers,
      //     params,
      //     data,
      //   },
      // );
      // RUSO usage
      const response = await cardRequest.updateStickerOnCard(
        cardId,
        'stickers',
        stickerId,
        data,
        params,
        headers,
      );
      const responseJSON = await response.json();
      const {
        image: actualStickerName,
        top: actualStickerFromTop,
        left: actualStickerFromLeft,
        zIndex: actualStickerZIndex,
        rotate: actualStickerRotateValue,
      } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualStickerName).toContain(expectedStickerName);
      expect(actualStickerFromTop).toEqual(expectedStickerFromTop);
      expect(actualStickerFromLeft).toEqual(expectedStickerFromLeft);
      expect(actualStickerZIndex).toEqual(expectedStickerOverlay);
      expect(actualStickerRotateValue).toEqual(expectedStickerRotation);

      dataForVerification = data;
    });
    await test.step('1.2 Should get a sticker field', async () => {
      // Arrange:
      const cardId = createdCardsIds[1];
      const stickerId = createdStickersIds[1];
      const expectedStatusCode = 200;
      // RUSO Usage
      // const getStickerFieldUrl = cardRequest.buildUrl(
      //   cardId,
      //   'stickers',
      //   stickerId,
      // );
      const stickerParams: ParamsDataModel = prepareParamsDataSimplified(
        '',
        '',
        '',
        undefined,
        false,
        '',
        'id,image,rotate',
      );
      const { image: expectedStickerName, rotate: expectedStickerRotation } =
        dataForVerification;

      // Act: 'https://api.trello.com/1/cards/{id}/stickers/{idSticker}?key=APIKey&token=APIToken
      // // RUSO Usage
      // const response = await cardRequest.sendRequest(
      //   'get',
      //   getStickerFieldUrl,
      //   {
      //     headers,
      //     params: { ...params, ...stickerParams },
      //   },
      // );
      // RUSO Usage
      const response = await cardRequest.getStickerElements(
        cardId,
        'stickers',
        stickerId,
        asRecord(stickerParams),
        headers,
      );
      const responseJSON = await response.json();
      const {
        id: actualStickerId,
        image: actualStickerName,
        rotate: actualStickerRotateValue,
      } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualStickerId).toEqual(stickerId);
      expect(actualStickerName).toContain(expectedStickerName);
      expect(actualStickerRotateValue).toEqual(expectedStickerRotation);
    });
  });

  test('2. Delete sticker and verify success', async ({ request }) => {
    const cardRequest = new CardRequest(request);
    await test.step('2.1 Should delete a sticker', async () => {
      // Arrange:
      const cardId = createdCardsIds[2];
      const stickerId = createdStickersIds[2];
      const expectedStatusCode = 200;
      const expectedResponseObject = [];

      // RUSO Usage
      // const deleteStickerUrl = cardRequest.buildUrl(
      //   cardId,
      //   'stickers',
      //   stickerId,
      // );

      // Act: 'https://api.trello.com/1/cards/{id}/stickers/{idSticker}?key=APIKey&token=APIToken'
      // // RUSO Usage
      // const response = await cardRequest.sendRequest(
      //   'delete',
      //   deleteStickerUrl,
      //   {
      //     headers,
      //     params,
      //   },
      // );
      // RUSO Usage
      const response = await cardRequest.deleteSticker(
        cardId,
        'stickers',
        stickerId,
        params,
        headers,
      );
      const responseJSON = await response.json();
      const { stickers: actualObjectArray } = responseJSON;

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(actualObjectArray).toEqual(expectedResponseObject);
    });
    await test.step('2.2 Should NOT get deleted sticker', async () => {
      // Arrange:
      const cardId = createdCardsIds[2];
      const expectedStatusCode = 200;
      const expectedResponseObject = [];
      // // Path parameters generator usage
      // const getDeletedStickerUrl = generatePathURLSimplified(
      //   pathParameters.cardParameter,
      //   cardId,
      //   'stickers',
      // );
      // RUSO usage
      // const getDeletedStickerUrl = cardRequest.buildUrl(cardId, 'stickers');

      // Act: 'https://api.trello.com/1/cards/{id}/stickers?key=APIKey&token=APIToken'
      // RUSO usage
      const response = await cardRequest.getSticker(
        cardId,
        'stickers',

        params,
        headers,
      );
      const responseJSON = await response.json();

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(responseJSON).toEqual(expectedResponseObject);
    });
  });

  test.afterEach('Delete added stickers', async ({ request }) => {
    // Arrange:
    const cardRequest = new CardRequest(request);
    // Act: 'https://api.trello.com/1/cards/{id}/stickers/{idSticker}?key=APIKey&token=APIToken'
    for (let i = 0; i < createdStickersIds.length; i++) {
      // RUSO usage
      // const deleteStickersUrl = cardRequest.buildUrl(
      //   createdCardsIds[i],
      //   'stickers',
      //   createdStickersIds[i],
      // );
      // ROP usage
      await cardRequest.deleteSticker(
        createdCardsIds[i],
        'stickers',
        createdStickersIds[i],
        params,
        headers,
      );
    }
    createdStickersIds = [];
    createdStickersNames = [];
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
    // RUSO usage
    await boardRequest.deleteBoard(createdBoardId, params, headers);
  });
});
