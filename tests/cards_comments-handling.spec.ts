import { API_KEY, TOKEN } from '@_config/env.config';
import { expect, test } from '@playwright/test';

test.describe.serial('Cards comments handling - dependent tests', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  let commentActionId: string;

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
  test('0.2. Card preparation', async ({ request }) => {
    // Arrange:
    const listId = createdListsIds[0];
    const expectedCardName = 'My first card for comments name';
    const expectedCardDueDate = new Date(
      new Date().setDate(new Date().getDate() + 2),
    ).toISOString();
    //Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/cards?idList=${listId}&name=${expectedCardName}&due=${expectedCardDueDate}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdCardId = responseJSON.id;
  });
  test('1. Should create a new comment on a card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedCardCommentText = 'My first comment on a card';
    const expectedCardCommentTextType = 'comment';

    //Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/cards/{id}/actions/comments?text={text}&key=APIKey&token=APIToken'
    const response = await request.post(
      `/1/cards/${createdCardId}/actions/comments?text=${expectedCardCommentText}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    // console.log(responseJSON.entities);

    //Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON.entities[0]).toHaveProperty('id');
    const actualCardCommentType =
      responseJSON.entities[responseJSON.entities.length - 1].type;
    expect(actualCardCommentType).toContain(expectedCardCommentTextType);
    const actualCardCommentText =
      responseJSON.entities[responseJSON.entities.length - 1].text;
    expect(actualCardCommentText).toContain(expectedCardCommentText);
  });
  test('2. Should get a comment on a card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedCardCommentText = 'My first comment on a card';

    //Optional headers
    const headers = { Accept: 'application/json' };

    // Act: 'https://api.trello.com/1/cards/{id}/actions?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/cards/${createdCardId}/actions?commentCard&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);
    commentActionId = responseJSON[0].id;

    //Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualCardCommentText = responseJSON[0].data.text;
    expect(actualCardCommentText).toContain(expectedCardCommentText);
  });
  test('3. Should update a comment action on a card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const updatedCardCommentText = 'Updated comment text';

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/cards/{id}/actions/{idAction}/comments?text={text}&key=APIKey&token=APIToken'
    const response = await request.put(
      `/1/cards/${createdCardId}/actions/${commentActionId}/comments?text=${updatedCardCommentText}&key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    //Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualCardCommentId = responseJSON.id;
    expect(actualCardCommentId).toContain(commentActionId);
    const actualCardCommentText = responseJSON.data.text;
    expect(actualCardCommentText).toContain(updatedCardCommentText);
  });
  test('4. Should Delete a comment action on a card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    const expectedResponseValue = null;

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/cards/{id}/actions/{idAction}/comments?key=APIKey&token=APIToken'
    const response = await request.delete(
      `/1/cards/${createdCardId}/actions/${commentActionId}/comments?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );
    const responseJSON = await response.json();
    // console.log(responseJSON);

    //Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    const actualResponseValue = responseJSON._value;
    expect(actualResponseValue).toEqual(expectedResponseValue);
  });
  test('5. (NP) Should Not Get deleted comment Action', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 404;
    const expectedResponseText = 'Not Found';

    //Optional headers
    const headers = { 'Content-Type': 'application/json' };

    // Act: 'https://api.trello.com/1/actions/{id}?key=APIKey&token=APIToken'
    const response = await request.get(
      `/1/actions/${commentActionId}?key=${API_KEY}&token=${TOKEN}`,
      { headers },
    );

    //Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(response.statusText()).toEqual(expectedResponseText);
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
