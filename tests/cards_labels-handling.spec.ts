import { API_KEY, TOKEN } from '@_config/env.config';
import { expect, test } from '@playwright/test';

test.describe.serial('Cards labels handling - dependent tests', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  const createdCardsIds: string[] = [];
  let createdBoardLabelId: string;
  let createdLabelOnCardId: string;

  test('0. Board preparation', async ({ request }) => {
    // Arrange:
    const expectedBoardName = `My Board - ${new Date().toISOString().split('T')[1].split('Z')[0]}`;

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };
    // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/boards/?name=${expectedBoardName}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdBoardId = responseJSON.id;
  });
  test('0.1 Collect Lists from Board', async ({ request }) => {
    // Arrange:
    //Optional headers
    const headers = { Accept: 'application/json' };
    // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/boards/${createdBoardId}/lists?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    responseJSON.forEach((listId: { id: string }) => {
      createdListsIds.push(listId.id);
    });
  });
  test('0.2. Cards preparation', async ({ request }) => {
    for (let i = 0; i < 2; i++) {
      // Arrange:
      const listId = createdListsIds[i];
      const expectedCardName = `Card for labels - ${new Date().getTime()}`;
      //   console.log(expectedCardName);
      const expectedCardDueDate = new Date(
        new Date().setDate(new Date().getDate() + (i + 1)),
      ).toISOString();
      //   console.log(expectedCardDueDate);
      //Optional headers
      const headers = { Accept: 'application/json' };

      // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
      const response = await request.post(
        `/1/cards?idList=${listId}&name=${expectedCardName}&due=${expectedCardDueDate}&key=${API_KEY}&token=${TOKEN}`,
        { headers },
      );
      const responseJSON = await response.json();
      // console.log(responseJSON);
      createdCardsIds.push(responseJSON.id);
    }
    // console.log(createdCardsIds);
  });
  test('1. Should create a new label', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedLabelColor = 'red';
    const expectedLabelName = `Do it ASAP - ${expectedLabelColor}`;

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/labels?name={name}&color={color}&idBoard={idBoard}&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/labels?name=${expectedLabelName}&color=${expectedLabelColor}&idBoard=${createdBoardId}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdBoardLabelId = responseJSON.id;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    const actualLabelName = responseJSON.name;
    expect(actualLabelName).toContain(expectedLabelName);
    const actualLabelColor = responseJSON.color;
    expect(actualLabelColor).toContain(expectedLabelColor);
  });
  test('2. Should add label to card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const cardId = createdCardsIds[0];

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/cards/{id}/idLabels?key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/cards/${cardId}/idLabels?value=${createdBoardLabelId}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualLabelId = responseJSON[0];
    expect(actualLabelId).toContain(createdBoardLabelId);
  });
  test('3. Should create label directly on card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const cardId = createdCardsIds[1];
    const expectedLabelColor = 'yellow';
    const expectedLabelName = `Custom label for a card - ${expectedLabelColor}`;

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/cards/{id}/labels?color={color}&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/cards/${cardId}/labels?color=${expectedLabelColor}&name=${expectedLabelName}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdLabelOnCardId = responseJSON.id;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    const actualLabelName = responseJSON.name;
    expect(actualLabelName).toContain(expectedLabelName);
    const actualLabelColor = responseJSON.color;
    expect(actualLabelColor).toContain(expectedLabelColor);
  });
  test('4. Should update whole label', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const updatedLabelColor = 'black';
    const updatedLabelName = `Custom label for a card - updated for deadly - ${updatedLabelColor}`;

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/labels/${createdBoardLabelId}?color=${updatedLabelColor}&name=${updatedLabelName}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    const actualLabelId = responseJSON.id;
    expect(actualLabelId).toContain(createdBoardLabelId);
    const actualLabelName = responseJSON.name;
    expect(actualLabelName).toContain(updatedLabelName);
    const actualLabelColor = responseJSON.color;
    expect(actualLabelColor).toContain(updatedLabelColor);
  });
  test('5. Should update field on label', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const updatedLabelColor = 'sky';

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/labels/{id}/{field}?value=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/labels/${createdLabelOnCardId}?color=${updatedLabelColor}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualLabelId = responseJSON.id;
    expect(actualLabelId).toContain(createdLabelOnCardId);
    const actualLabelColor = responseJSON.color;
    expect(actualLabelColor).toContain(updatedLabelColor);
  });
  test('6. Should delete a label', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedResponseValue = '{}';

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken'
    const response = await request.delete(
      `/1/labels/${createdLabelOnCardId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualResponseValue = JSON.stringify(responseJSON.limits);
    expect(actualResponseValue).toContain(expectedResponseValue);
  });
  test('7. (NP) Should NOT get deleted label', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 404;
    const expectedResponseStatusText = 'Not Found';

    //Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/labels/${createdLabelOnCardId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(response.statusText()).toContain(expectedResponseStatusText);
  });
  test('Delete a board', async ({ request }) => {
    // Arrange:
    //Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(
      `/1/boards/${createdBoardId}/?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
  });
});
