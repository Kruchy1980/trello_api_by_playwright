import { prepareRandomBoardData } from '@_src/API/factories/board-data.factory';
import { prepareRandomStickerData } from '@_src/API/factories/card_stickers-data.factory';
import { prepareRandomCardData } from '@_src/API/factories/cards-data.factory';
import { prepareParamsData } from '@_src/API/factories/params-data.factory';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { CardDataModel } from '@_src/API/models/card-data.model';
import { CardStickerDataModel } from '@_src/API/models/card_stickers-data.model';
import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Prepare factories for models handling
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Cards stickers handling - factories implementation', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  const createdCardsIds: string[] = [];
  let createdStickersIds: string[] = [];
  let createdStickersNames: string[] = [];

  test.beforeAll(
    'Board, card preparation and collect lists ids',
    async ({ request }) => {
      // Arrange:
      // const data: BoardDataModel = {
      //   name: `My Board - ${new Date().toISOString().split('T')[1].split('Z')[0]}`,
      // };
      const data: BoardDataModel = prepareRandomBoardData();

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      const response = await request.post(`/1/boards`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);
      createdBoardId = responseJSON.id;

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
      responseListsIdsJSON.forEach((listId: { id: string }) => {
        createdListsIds.push(listId.id);
      });

      // Card Preparation
      for (let i = 0; i < 3; i++) {
        // Arrange:
        // const data: CardDataModel = {
        //   idList: createdListsIds[i],
        //   name: `Card for labels - ${new Date().getTime()}`,
        //   due: new Date(
        //     new Date().setDate(new Date().getDate() + (i + 1)),
        //   ).toISOString(),
        // };
        const data: CardDataModel = prepareRandomCardData(
          createdListsIds[i],
          'Card Name',
          undefined,
          undefined,
          undefined,
          true,
          i + 1,
        );

        // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
        const response = await request.post(`/1/cards`, {
          headers,
          params,
          data,
        });
        const responseJSON = await response.json();
        // console.log(responseJSON);
        createdCardsIds.push(responseJSON.id);
      }
    },
  );

  test.beforeEach('Add a sticker to a card', async ({ request }) => {
    // const stickersNames = ['check', 'thumbsdown', 'rocketship'];
    // for (let i = 0; i < stickersNames.length; i++) {
    for (let i = 0; i < 3; i++) {
      // Arrange:
      const expectedStatusCode = 200;
      // const data: CardStickerDataModel = {
      //   image: stickersNames[i],
      //   top: 20.22,
      //   left: 50.22,
      //   zIndex: 5,
      // };
      const data: CardStickerDataModel = prepareRandomStickerData(
        '',
        20.22,
        50.22,
        3,
      );
      // console.log('Add Sticker:', data.image);

      // Act: 'https://api.trello.com/1/cards/{id}/stickers?image={image}&top={top}&left={left}&zIndex={zIndex}&key=APIKey&token=APIToken'
      const response = await request.post(
        `/1/cards/${createdCardsIds[i]}/stickers`,
        { headers, params, data },
      );
      const responseJSON = await response.json();
      //   console.log(responseJSON);
      createdStickersIds.push(responseJSON.id);
      // Add stickers names to variable for further update
      createdStickersNames.push(responseJSON.image);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualStickerName = responseJSON.image;
      expect(actualStickerName).toContain(data.image);
      const actualStickerFromTop = responseJSON.top;
      expect(actualStickerFromTop).toEqual(data.top);
      const actualStickerFromLeft = responseJSON.left;
      expect(actualStickerFromLeft).toEqual(data.left);
      const actualStickerZIndex = responseJSON.zIndex;
      expect(actualStickerZIndex).toEqual(data.zIndex);
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
      // const data: CardStickerDataModel = {
      //   image: createdStickerName,
      //   top: 100,
      //   left: 50,
      //   zIndex: 5,
      //   rotate: 180,
      // };
      const data: CardStickerDataModel = prepareRandomStickerData(
        createdStickersNames[1],
        12,
        undefined,
        2,
        180,
      );
      // console.log('Update:', data);
      // Act: /1/cards/{id}/stickers/{idSticker}?top={top}&left={left}&zIndex={zIndex}
      const response = await request.put(
        `/1/cards/${cardId}/stickers/${stickerId}`,
        { headers, params, data },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualStickerName = responseJSON.image;
      expect(actualStickerName).toContain(data.image);
      const actualStickerFromTop = responseJSON.top;
      expect(actualStickerFromTop).toEqual(data.top);
      const actualStickerFromLeft = responseJSON.left;
      expect(actualStickerFromLeft).toEqual(data.left);
      const actualStickerZIndex = responseJSON.zIndex;
      expect(actualStickerZIndex).toEqual(data.zIndex);
      const actualStickerRotateValue = responseJSON.rotate;
      expect(actualStickerRotateValue).toEqual(data.rotate);
      // Pass data to variable
      dataForVerification = data;
    });
    await test.step('1.2 Should get a sticker field', async () => {
      // console.log(dataForVerificationStickers);
      // Arrange:
      const cardId = createdCardsIds[1];
      const stickerId = createdStickersIds[1];
      const expectedStatusCode = 200;

      // const stickerParams: ParamsDataModel = {
      //   key: params.key,
      //   token: params.token,
      //   fields: 'id,image,rotate',
      // };
      const stickerParams: ParamsDataModel = prepareParamsData(
        '',
        '',
        '',
        '',
        false,
        '',
        'id,image,rotate',
      );

      // Act: 'https://api.trello.com/1/cards/{id}/stickers/{idSticker}?key=APIKey&token=APIToken
      const response = await request.get(
        `/1/cards/${cardId}/stickers/${stickerId}`,
        { headers, params: { ...params, ...stickerParams } },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualStickerId = responseJSON.id;
      expect(actualStickerId).toEqual(stickerId);
      const actualStickerName = responseJSON.image;
      expect(actualStickerName).toContain(dataForVerification.image);
      const actualStickerRotateValue = responseJSON.rotate;
      expect(actualStickerRotateValue).toEqual(dataForVerification.rotate);
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
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualObjectArray = responseJSON.stickers;
      expect(actualObjectArray).toEqual(expectedResponseObject);
    });
    await test.step('2.2 Should NOT get deleted sticker', async () => {
      // Arrange:
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
