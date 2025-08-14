import { headers, params } from '@_src/API/utils/api_utils';
import { expect, test } from '@playwright/test';

// TODO: For refactoring
// TODO: Prepare models for data generation
// TODO: Prepare factories for models handling
// TODO: Make the models and factories simpler to use
// TODO: Prepare functions for generate URLS
// TODO: Simplify the URLS generation

test.describe('Cards handling - independent tests', () => {
  let createdBoardId: string;
  const createdListsIds: string[] = [];
  let createdCardId: string;
  // let updatedCardDueDate: string;
  let data: { [key: string]: string };
  test.beforeAll(
    'Board preparation and lists collection',
    async ({ request }) => {
      // Arrange:
      // const expectedBoardName = `My Board - ${new Date().toISOString().split('T')[1].split('Z')[0]}`;
      data = {
        name: `My Board - ${new Date().toISOString().split('T')[1].split('Z')[0]}`,
      };

      // Act: 'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken'
      const response = await request.post(`/1/boards`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);
      createdBoardId = responseJSON.id;

      // Collecting lists
      // Arrange:
      // Act: 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken'
      const responseGetLists = await request.get(
        `/1/boards/${createdBoardId}/lists`,
        {
          headers,
          params,
        },
      );
      const responseGetListsJSON = await responseGetLists.json();
      // console.log(responseJSON);
      responseGetListsJSON.forEach((listId: { id: string }) => {
        createdListsIds.push(listId.id);
      });
    },
  );
  test.beforeEach('Create a new card', async ({ request }) => {
    // Arrange:
    const expectedStatusCode = 200;
    // const listId = createdListsIds[0];
    // const expectedCardName = 'My first card name';
    // const expectedCardDescription = 'My first card Description';
    // const expectedCardDueDate = new Date().toISOString();
    data = {
      idList: createdListsIds[0],
      name: 'My first card name',
      desc: 'My first card Description',
      due: new Date().toISOString(),
    };

    // Act: 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
    const response = await request.post(`/1/cards`, { headers, params, data });
    const responseJSON = await response.json();
    // console.log(responseJSON);
    createdCardId = responseJSON.id;

    // Assert:
    expect(response.status()).toEqual(expectedStatusCode);
    expect(responseJSON).toHaveProperty('id');
    const actualCardName = responseJSON.name;
    expect(actualCardName).toContain(data.name);
    const actualCardDescription = responseJSON.desc;
    expect(actualCardDescription).toContain(data.desc);
    const actualCardDueDate = responseJSON.due;
    expect(actualCardDueDate).toContain(data.due);
  });

  test('1. Update and get updated card', async ({ request }) => {
    // For Solution I
    // let updateCardDescription: string;
    await test.step('1.1 Should update a Card', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      // const updatedCardName = 'My first card name - update';
      // updatedCardDueDate = new Date(
      //   new Date().setDate(new Date().getDate() + 2),
      // ).toISOString();
      data = {
        name: 'My first card name - update',
        due: new Date(
          new Date().setDate(new Date().getDate() + 2),
        ).toISOString(),
      };

      // Act: 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      const response = await request.put(`/1/cards/${createdCardId}`, {
        headers,
        params,
        data,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualCardId = responseJSON.id;
      expect(actualCardId).toContain(createdCardId);
      const actualCardName = responseJSON.name;
      expect(actualCardName).toContain(data.name);
      const actualCardDueDate = responseJSON.due;
      expect(actualCardDueDate).toContain(data.due);
      // Update the data object Solution I
      // updateCardDescription = responseJSON.desc;
      // Solution II updated data object
      data.desc = responseJSON.desc;
    });
    await test.step('1.2 Should get a Card fields', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      // const expectedCardName = 'My first card name - update';
      // const expectedCardDescription = 'My first card Description';

      const updatedCardParams = {
        key: params.key,
        token: params.token,
        fields: 'name,desc,due',
      };

      // Act: ('https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      const response = await request.get(`/1/cards/${createdCardId}`, {
        headers,
        params: updatedCardParams,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualCardId = responseJSON.id;
      expect(actualCardId).toContain(createdCardId);
      const actualCardName = responseJSON.name;
      expect(actualCardName).toContain(data.name);
      const actualCardDescription = responseJSON.desc;
      expect(actualCardDescription).toContain(data.desc);
      const actualCardDueDate = responseJSON.due;
      expect(actualCardDueDate).toContain(data.due);
    });
  });
  test('2. Delete and verify deleted card', async ({ request }) => {
    await test.step('2.1 Should delete a Card', async () => {
      // Arrange:
      const expectedStatusCode = 200;
      const expectedResponseObject = '{}';

      // Act: 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      const response = await request.delete(`/1/cards/${createdCardId}`, {
        headers,
        params,
      });
      const responseJSON = await response.json();
      // console.log(responseJSON);

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      const actualResponseObject = JSON.stringify(responseJSON.limits);
      expect(actualResponseObject).toContain(expectedResponseObject);
    });
    await test.step('2.2 (NP) Should NOT get deleted card', async () => {
      // Arrange:
      const expectedStatusCode = 404;
      const expectedStatusText = 'Not Found';
      const deletedCardParams = {
        key: params.key,
        token: params.token,
        fields: 'name,desc,due',
      };

      // Act: ('https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'
      const response = await request.get(`/1/cards/${createdCardId}`, {
        headers,
        params: deletedCardParams,
      });

      // Assert:
      expect(response.status()).toEqual(expectedStatusCode);
      expect(response.statusText()).toContain(expectedStatusText);
    });
  });
  test.afterAll('Delete a board', async ({ request }) => {
    // Act: 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    await request.delete(`/1/boards/${createdBoardId}`, { headers, params });
  });
});
