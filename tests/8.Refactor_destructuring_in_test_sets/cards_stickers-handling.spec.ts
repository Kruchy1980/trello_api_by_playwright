import { prepareRandomBoardDataSimplified } from '@_src/API/factories/simplified_factories/board-data.factory';
import { prepareRandomStickerDataSimplified } from '@_src/API/factories/simplified_factories/card_stickers-data.factory';
import { prepareRandomCardDataSimplified } from '@_src/API/factories/simplified_factories/cards-data.factory';
import { prepareParamsDataSimplified } from '@_src/API/factories/simplified_factories/params-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { CardStickerDataModel } from '@_src/API/models/card_stickers-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Improve tests by destructuring objects
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Cards stickers handling - destructured', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  const createdCardsIds: string[] = [];
  let createdStickersIds: string[] = [];
  let createdStickersNames: string[] = [];

  test.beforeAll(
    'Board, card preparation and collect lists ids',
    async ({ request }) => {
      // Arrange:
      const data: BoardDataModel = prepareRandomBoardDataSimplified();

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      const response = await request.post(`/1/boards`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);
      // Destructuring responseJSON object
      const { id: expectedBoardId } = responseJSON;
      // Before Destructuring
      // createdBoardId = responseJSON.id;
      // Before Destructuring
      createdBoardId = expectedBoardId;

      // Collect lists Id's
      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      const responseListsIds = await request.get(
        `/1/boards/${createdBoardId}/lists`,
        {
          headers,
          params,
        },
      );
      const responseListsIdsJSON = await responseListsIds.json();
      // console.log(responseJSON);
      // Before destructuring:
      // responseListsIdsJSON.forEach((listId: { id: string }) => {
      //   createdListsIds.push(listId.id);
      // After destructuring - destructure inside loop
      responseListsIdsJSON.forEach(({ id }: { id: string }) => {
        createdListsIds.push(id);
      });

      // Card Preparation
      for (let i = 0; i < 3; i++) {
        // Arrange:
        const data: CardDataModel = prepareRandomCardDataSimplified(
          createdListsIds[i],
          'Card Name',
          undefined,
          undefined,
          undefined,
          true,
          i + 1,
        );
        // console.log('Card data preparation:,', data);

        // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
        const response = await request.post(`/1/cards`, {
          headers,
          params,
          data,
        });
        const responseJSON = await response.json();
        // console.log(responseJSON);
        // Destructuring JSON
        const { id: expectedCardId } = responseJSON;
        //Before destructuring
        // createdCardsIds.push(responseJSON.id);
        //Before destructuring
        createdCardsIds.push(expectedCardId);
      }
    },
  );

  test.beforeEach('Add a sticker to a card', async ({ request }) => {
    for (let i = 0; i < 3; i++) {
      // Arrange:
      const expectedStatusCode = 200;
      const data: CardStickerDataModel = prepareRandomStickerDataSimplified(
        '',
        20.22,
        50.22,
        3,
      );
      // console.log('Add Sticker:', data);
      // Destructuring data object
      const {
        image: expectedStickerName,
        top: expectedStickerFromTop,
        left: expectedStickerFromLeft,
        zIndex: expectedStickerOverlay,
      } = data;

      // Act: 'https://api.trello.com/1/cards/{id}/stickers?image={image}&top={top}&left={left}&zIndex={zIndex}&key=APIKey&token=APIToken'
      const response = await request.post(
        `/1/cards/${createdCardsIds[i]}/stickers`,
        { headers, params, data },
      );
      const responseJSON = await response.json();
      // console.log('Stickers Created details', responseJSON);
      // Destructuring response JSON object
      const {
        id: actualStickerId,
        image: actualStickerName,
        top: actualStickerFromTop,
        left: actualStickerFromLeft,
        zIndex: actualStickerZIndex,
      } = responseJSON;

      // Assert:
      // Before Destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualStickerName = responseJSON.image;
      // expect(actualStickerName).toContain(data.image);
      // const actualStickerFromTop = responseJSON.top;
      // expect(actualStickerFromTop).toEqual(data.top);
      // const actualStickerFromLeft = responseJSON.left;
      // expect(actualStickerFromLeft).toEqual(data.left);
      // const actualStickerZIndex = responseJSON.zIndex;
      // expect(actualStickerZIndex).toEqual(data.zIndex);
      // // === Passing proper values to proper tables ===
      // // Add stickersIds to variable for further update
      // createdStickersIds.push(responseJSON.id);
      // // Add stickers names to variable for further update
      // createdStickersNames.push(responseJSON.image);
      // After Destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualStickerName = responseJSON.image;
      expect(actualStickerName).toContain(expectedStickerName);
      // const actualStickerFromTop = responseJSON.top;
      expect(actualStickerFromTop).toEqual(expectedStickerFromTop);
      // const actualStickerFromLeft = responseJSON.left;
      expect(actualStickerFromLeft).toEqual(expectedStickerFromLeft);
      // const actualStickerZIndex = responseJSON.zIndex;
      expect(actualStickerZIndex).toEqual(expectedStickerOverlay);

      // === Passing proper values to proper tables ===
      // Add stickersIds to variable for further update
      createdStickersIds.push(actualStickerId);
      // Add stickers names to variable for further update
      createdStickersNames.push(actualStickerName);
    }
    // console.log('Full names array', createdStickersNames);
  });
  test('1. Update sticker field and verify success', async ({ request }) => {
    let dataForVerification: CardStickerDataModel;
    await test.step('1.1 Should update sticker on card', async () => {
      // Arrange:
      const cardId = createdCardsIds[1];
      const stickerId = createdStickersIds[1];
      const expectedStatusCode = 200;
      const data: CardStickerDataModel = prepareRandomStickerDataSimplified(
        createdStickersNames[1],
        12,
        undefined,
        2,
        180,
      );
      // console.log('Update:', data);
      // Destructuring data object
      const {
        image: expectedStickerName,
        top: expectedStickerFromTop,
        left: expectedStickerFromLeft,
        zIndex: expectedStickerOverlay,
        rotate: expectedStickerRotation,
      } = data;

      // Act: /1/cards/{id}/stickers/{idSticker}?top={top}&left={left}&zIndex={zIndex}
      const response = await request.put(
        `/1/cards/${cardId}/stickers/${stickerId}`,
        { headers, params, data },
      );
      const responseJSON = await response.json();
      // console.log('Updated sticker responseJSON', responseJSON);
      const {
        image: actualStickerName,
        top: actualStickerFromTop,
        left: actualStickerFromLeft,
        zIndex: actualStickerZIndex,
        rotate: actualStickerRotateValue,
      } = responseJSON;

      // Assert:
      // Before destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualStickerName = responseJSON.image;
      // expect(actualStickerName).toContain(data.image);
      // const actualStickerFromTop = responseJSON.top;
      // expect(actualStickerFromTop).toEqual(data.top);
      // const actualStickerFromLeft = responseJSON.left;
      // expect(actualStickerFromLeft).toEqual(data.left);
      // const actualStickerZIndex = responseJSON.zIndex;
      // expect(actualStickerZIndex).toEqual(data.zIndex);
      // const actualStickerRotateValue = responseJSON.rotate;
      // expect(actualStickerRotateValue).toEqual(data.rotate);
      // === Pass data object to variable ===
      dataForVerification = data;
      // After destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualStickerName = responseJSON.image;
      expect(actualStickerName).toContain(expectedStickerName);
      // const actualStickerFromTop = responseJSON.top;
      expect(actualStickerFromTop).toEqual(expectedStickerFromTop);
      // const actualStickerFromLeft = responseJSON.left;
      expect(actualStickerFromLeft).toEqual(expectedStickerFromLeft);
      // const actualStickerZIndex = responseJSON.zIndex;
      expect(actualStickerZIndex).toEqual(expectedStickerOverlay);
      // const actualStickerRotateValue = responseJSON.rotate;
      expect(actualStickerRotateValue).toEqual(expectedStickerRotation);
      // === Pass data object to variable ===
      dataForVerification = data;
    });
    await test.step('1.2 Should get a sticker field', async () => {
      // Arrange:
      const cardId = createdCardsIds[1];
      const stickerId = createdStickersIds[1];
      const expectedStatusCode = 200;
      const stickerParams: ParamsDataModel = prepareParamsDataSimplified(
        '',
        '',
        '',
        undefined,
        false,
        '',
        'id,image,rotate',
      );
      // console.log(stickerParams);
      // Destructing dataForVerification returned object form step no 1
      const {
        image: expectedStickerName,
        rotate: expectedStickerRotation,
        // ...restValuesObject
      } = dataForVerification;
      // Just for verification purpose
      // console.log('Rest from the object:', restValuesObject);

      // Act: 'https://api.trello.com/1/cards/{id}/stickers/{idSticker}?key=APIKey&token=APIToken
      const response = await request.get(
        `/1/cards/${cardId}/stickers/${stickerId}`,
        { headers, params: { ...params, ...stickerParams } },
      );
      const responseJSON = await response.json();
      // console.log('Verification JSON object', responseJSON);
      // Destructuring responseJSON object
      const {
        id: actualStickerId,
        image: actualStickerName,
        rotate: actualStickerRotateValue,
      } = responseJSON;

      // Assert:
      // Before destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualStickerId = responseJSON.id;
      // expect(actualStickerId).toEqual(stickerId);
      // const actualStickerName = responseJSON.image;
      // expect(actualStickerName).toContain(dataForVerification.image);
      // const actualStickerRotateValue = responseJSON.rotate;
      // expect(actualStickerRotateValue).toEqual(dataForVerification.rotate);
      // After destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualStickerId = responseJSON.id;
      expect(actualStickerId).toEqual(stickerId);
      // const actualStickerName = responseJSON.image;
      expect(actualStickerName).toContain(expectedStickerName);
      // const actualStickerRotateValue = responseJSON.rotate;
      expect(actualStickerRotateValue).toEqual(expectedStickerRotation);
    });
  });

  test('2. Delete sticker and verify success', async ({ request }) => {
    await test.step('2.1 Should delete a sticker', async () => {
      // Arrange:
      const cardId = createdCardsIds[2];
      const stickerId = createdStickersIds[2];
      const expectedStatusCode = 200;
      const expectedResponseObject = [];

      // Act: 'https://api.trello.com/1/cards/{id}/stickers/{idSticker}?key=APIKey&token=APIToken'
      const response = await request.delete(
        `/1/cards/${cardId}/stickers/${stickerId}`,
        { headers, params },
      );
      const responseJSON = await response.json();
      // console.log('Response from deletion Sticker', responseJSON);
      // Destructuring responseJSON object
      const { stickers: actualObjectArray } = responseJSON;

      // Assert:
      // Before destructuring
      // expect(response.status()).toEqual(expectedStatusCode);
      // const actualObjectArray = responseJSON.stickers;
      // expect(actualObjectArray).toEqual(expectedResponseObject);
      // After destructuring
      expect(response.status()).toEqual(expectedStatusCode);
      // const actualObjectArray = responseJSON.stickers;
      expect(actualObjectArray).toEqual(expectedResponseObject);
    });
    await test.step('2.2 Should NOT get deleted sticker', async () => {
      // Arrange: !! No destructuring needed
      const cardId = createdCardsIds[2];
      const expectedStatusCode = 200;
      const expectedResponseObject = [];

      // Act: 'https://api.trello.com/1/cards/{id}/stickers/{idSticker}?key=APIKey&token=APIToken'
      const response = await request.get(`/1/cards/${cardId}/stickers`, {
        headers,
        params,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(responseJSON).toEqual(expectedResponseObject);
    });
  });

  test.afterEach('Delete added stickers', async ({ request }) => {
    // Act:
    for (let i = 0; i < createdStickersIds.length; i++) {
      await request.delete(
        `/1/cards/${createdCardsIds[i]}/stickers/${createdStickersIds[i]}`,
        { headers, params },
      );
    }
    createdStickersIds = [];
    createdStickersNames = [];
  });

  test.afterAll('Delete a board', async ({ request }) => {
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
  });
});
