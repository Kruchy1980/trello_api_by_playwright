import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Remove duplicated headers from tests
// TODO: Separate auth keys from URL
// TODO: Make tests independent
// TODO: Prepare models for data generation
// TODO: Prepare factories for models handling
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe.serial('Cards stickers handling - dependent tests', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  const createdCardsIds: string[] = [];
  const createdStickersIds: string[] = [];
  // const headers: { [key: string]: string } = {
  //   'Content-Type': 'application/json',
  //   Accept: 'application/json',
  // };
  // const params: { [key: string]: string } = { key: API_KEY, token: TOKEN };

  test('0. Board preparation', async ({ request }) => {
    // Arrange:
    const expectedBoardName = `My Board - ${new Date().toISOString().split('T')[1].split('Z')[0]}`;

    //Optional headers
    // const headers = { 'Content-Type': 'application/json' };
    // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/boards/?name=${expectedBoardName}`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdBoardId = responseJSON.id;
  });
  test('0.1 Collect Lists from Board', async ({ request }) => {
    // Arrange:
    //Optional headers
    // const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
    const response = await request.get(`/1/boards/${createdBoardId}/lists`, {
      headers,
      params,
    });
    const responseJSON = await response.json();
    // console.log(responseJSON);
    responseJSON.forEach((listId: { id: string }) => {
      createdListsIds.push(listId.id);
    });
  });
  test('0.2. Cards preparation', async ({ request }) => {
    for (let i = 0; i < 3; i++) {
      // Arrange:
      const listId = createdListsIds[i];
      const expectedCardName = `Card for labels - ${new Date().getTime()}`;
      //   console.log(expectedCardName);
      const expectedCardDueDate = new Date(
        new Date().setDate(new Date().getDate() + (i + 1)),
      ).toISOString();
      //   console.log(expectedCardDueDate);
      //Optional headers
      // const headers = { Accept: 'application/json' };

      // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      const response = await request.post(
        `/1/cards?idList=${listId}&name=${expectedCardName}&due=${expectedCardDueDate}`,
        { headers, params },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);
      createdCardsIds.push(responseJSON.id);
    }
  });
  test('1. Should add a sticker to a card', async ({ request }) => {
    const stickersNames = ['check', 'thumbsdown', 'rocketship'];
    for (let i = 0; i < stickersNames.length; i++) {
      // Arrange:
      const expectedStatusCode = 200;
      const expectedStickerName = stickersNames[i];
      const expectedStickerFromTop = 20.22;
      const expectedStickerFromLeft = 50.22;
      const expectedStickerZIndex = 5;

      //Optional headers
      // const headers = { 'Content-Type': 'application/json' };

      // Act: 'https://api.trello.com/1/cards/{id}/stickers?image={image}&top={top}&left={left}&zIndex={zIndex}&key=APIKey&token=APIToken'
      const response = await request.post(
        `/1/cards/${createdCardsIds[i]}/stickers?image=${expectedStickerName}&top=${expectedStickerFromTop}&left=${expectedStickerFromLeft}&zIndex=${expectedStickerZIndex}`,
        { headers, params },
      );
      const responseJSON = await response.json();
      //   console.log(responseJSON);
      createdStickersIds.push(responseJSON.id);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualStickerName = responseJSON.image;
      expect(actualStickerName).toContain(expectedStickerName);
      const actualStickerFromTop = responseJSON.top;
      expect(actualStickerFromTop).toEqual(expectedStickerFromTop);
      const actualStickerFromLeft = responseJSON.left;
      expect(actualStickerFromLeft).toEqual(expectedStickerFromLeft);
      const actualStickerZIndex = responseJSON.zIndex;
      expect(actualStickerZIndex).toEqual(expectedStickerZIndex);
    }
  });
  test('2. Should update sticker on card', async ({ request }) => {
    // Arrange:
    const cardId = createdCardsIds[1];
    const stickerId = createdStickersIds[1];
    const expectedStatusCode = 200;
    const expectedStickerName = 'thumbsdown';
    const expectedStickerFromTop = 100;
    const expectedStickerFromLeft = 50;
    const expectedStickerZIndex = 5;
    const expectedStickerRotateValue = 180;

    //Optional headers
    // const headers = { 'Content-Type': 'application/json' };

    // Act: /1/cards/{id}/stickers/{idSticker}?top={top}&left={left}&zIndex={zIndex}
    const response = await request.put(
      `/1/cards/${cardId}/stickers/${stickerId}?rotate=${expectedStickerRotateValue}&top=${expectedStickerFromTop}&left=${expectedStickerFromLeft}&zIndex=${expectedStickerZIndex}`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualStickerName = responseJSON.image;
    expect(actualStickerName).toContain(expectedStickerName);
    const actualStickerFromTop = responseJSON.top;
    expect(actualStickerFromTop).toEqual(expectedStickerFromTop);
    const actualStickerFromLeft = responseJSON.left;
    expect(actualStickerFromLeft).toEqual(expectedStickerFromLeft);
    const actualStickerZIndex = responseJSON.zIndex;
    expect(actualStickerZIndex).toEqual(expectedStickerZIndex);
    const actualStickerRotateValue = responseJSON.rotate;
    expect(actualStickerRotateValue).toEqual(expectedStickerRotateValue);
  });
  test('3. Should get a sticker field', async ({ request }) => {
    // Arrange:
    const cardId = createdCardsIds[1];
    const stickerId = createdStickersIds[1];
    const expectedStatusCode = 200;
    const fields = 'id,image,rotate';
    const expectedStickerName = 'thumbsdown';
    const expectedStickerRotateValue = 180;

    //Optional headers
    // const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/cards/{id}/stickers/{idSticker}?key=APIKey&token=APIToken
    const response = await request.get(
      `/1/cards/${cardId}/stickers/${stickerId}?fields=${fields}`,
      { headers, params },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualStickerId = responseJSON.id;
    expect(actualStickerId).toEqual(stickerId);
    const actualStickerName = responseJSON.image;
    expect(actualStickerName).toContain(expectedStickerName);
    const actualStickerRotateValue = responseJSON.rotate;
    expect(actualStickerRotateValue).toEqual(expectedStickerRotateValue);
  });
  test('4. Should delete a sticker', async ({ request }) => {
    // Arrange:
    const cardId = createdCardsIds[2];
    const stickerId = createdStickersIds[2];
    const expectedStatusCode = 200;
    const expectedResponseObject = [];

    //Optional headers
    // const headers = { 'Content-Type': 'application/json' };

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
  test('5. Should NOT get deleted sticker', async ({ request }) => {
    // Arrange:
    const cardId = createdCardsIds[2];
    const expectedStatusCode = 200;
    const expectedResponseObject = [];

    //Optional headers
    // const headers = { Accept: 'application/json' };

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
  test('Delete a board', async ({ request }) => {
    // Arrange:
    //Optional headers
    // const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
  });
});
