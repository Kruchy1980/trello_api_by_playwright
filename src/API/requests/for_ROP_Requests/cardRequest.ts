import { CardDataModel } from '@_src/API/models/card-data.model';
import { CardCommentDataModel } from '@_src/API/models/card_comments-data.model';
import {
  LabelDataModelSimplified,
  LabelOperationsDataModelSimplified,
} from '@_src/API/models/card_label_new_version_model/card_label_model_simplified';
import { CardStickerDataModel } from '@_src/API/models/card_stickers-data.model';
import { pathParameters } from '@_src/API/utils/path_parameters_utils';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseRequest } from './baseRequest';

export class CardRequest extends BaseRequest {
  protected readonly basePath: string;

  constructor(request: APIRequestContext) {
    super(request);
    this.basePath = pathParameters.cardParameter;
  }
  // CARDS
  // 'https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken': POST
  public async createCard(
    data: CardDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('POST', this.buildUrl(), {
      headers,
      params,
      data,
    });
  }
  //  // Act: 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken': PUT
  public async updateCard(
    id: string,
    data: CardDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('PUT', this.buildUrl(id), {
      headers,
      params,
      data,
    });
  }
  // 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken'; - GET Card elements
  public async getCardElements(
    id: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('GET', this.buildUrl(id), {
      headers,
      params,
    });
  }
  // 'https://api.trello.com/1/cards/{id}?key=APIKey&token=APIToken': DELETE
  public async deleteCard(
    id: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('DELETE', this.buildUrl(id), {
      headers,
      params,
    });
  }
  // CARD COMMENTS
  // Think about build new class for the following methods - is that necessary - base path is cards !!!
  // 'https://api.trello.com/1/cards/{id}/actions/comments?text={text}&key=APIKey&token=APIToken';: POST
  public async createCardComment(
    id: string,
    actionValue: string,
    field: string,
    data: CardCommentDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('POST', this.buildUrl(id, actionValue, field), {
      headers,
      params,
      data,
    });
  }
  // 'https://api.trello.com/1/cards/{id}/actions?key=APIKey&token=APIToken': GET
  public async getCardComment(
    id: string,
    actionValue: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('GET', this.buildUrl(id, actionValue), {
      headers,
      params,
    });
  }
  //'https://api.trello.com/1/cards/{id}/actions/{idAction}/comments?text={text}&key=APIKey&token=APIToken': PUT
  public async updateCardCommentAction(
    id: string,
    actionValue: string,
    actionId: string,
    field: string,
    data: CardCommentDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest(
      'PUT',
      this.buildUrl(id, actionValue, actionId, field),
      {
        headers,
        params,
        data,
      },
    );
  }
  // 'https://api.trello.com/1/cards/{id}/actions/{idAction}/comments?key=APIKey&token=APIToken': DELETE
  public async deleteCardCommentAction(
    id: string,
    actionValue: string,
    actionId: string,
    field: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest(
      'DELETE',
      this.buildUrl(id, actionValue, actionId, field),
      {
        headers,
        params,
      },
    );
  }
  // LABELS
  // 'https://api.trello.com/1/cards/{id}/idLabels?key=APIKey&token=APIToken';: POST
  public async addLabelToCard(
    id: string,
    field: string,
    data: LabelOperationsDataModelSimplified,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('POST', this.buildUrl(id, field), {
      headers,
      params,
      data,
    });
  }
  // 'https://api.trello.com/1/cards/{id}/labels?color={color}&key=APIKey&token=APIToken';: POST
  public async createLabelOnCard(
    id: string,
    field: string,
    data: LabelDataModelSimplified,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('POST', this.buildUrl(id, field), {
      headers,
      params,
      data,
    });
  }
  // STICKERS
  // 'https://api.trello.com/1/cards/{id}/stickers?image={image}&top={top}&left={left}&zIndex={zIndex}&key=APIKey&token=APIToken';: POST
  public async addStickerToCard(
    id: string,
    field: string,
    data: CardStickerDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('POST', this.buildUrl(id, field), {
      headers,
      params,
      data,
    });
  }
  // /1/cards/{id}/stickers/{idSticker}?top={top}&left={left}&zIndex={zIndex}: PUT
  public async updateStickerOnCard(
    id: string,
    field: string,
    stickerId: string,
    data: CardStickerDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('PUT', this.buildUrl(id, field, stickerId), {
      headers,
      params,
      data,
    });
  }
  // 'https://api.trello.com/1/cards/{id}/stickers/{idSticker}?key=APIKey&token=APIToken: GET
  public async getStickerElements(
    id: string,
    field: string,
    stickerId: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('GET', this.buildUrl(id, field, stickerId), {
      headers,
      params,
    });
  }
  // 'https://api.trello.com/1/cards/{id}/stickers/{idSticker}?key=APIKey&token=APIToken': DELETE
  public async deleteSticker(
    id: string,
    field: string,
    stickerId: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('DELETE', this.buildUrl(id, field, stickerId), {
      headers,
      params,
    });
  }
  // 'https://api.trello.com/1/cards/{id}/stickers?key=APIKey&token=APIToken': GET
  public async getSticker(
    id: string,
    field: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('GET', this.buildUrl(id, field), {
      headers,
      params,
    });
  }
  // CHECKITEMS
  // /1/cards/${cardId}/checkItem/${checkItemToMoveId}: PUT
  public async editCardElement(
    idMain: string,
    element: string,
    idTo: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('PUT', this.buildUrl(idMain, element, idTo), {
      headers,
      params,
    });
  }
}
