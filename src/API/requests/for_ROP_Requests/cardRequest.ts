import { CardDataModel } from '@_src/API/models/card-data.model';
import { pathParameters } from '@_src/API/utils/path_parameters_utils';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseRequest } from './baseRequest';

export class CardRequest extends BaseRequest {
  protected readonly basePath: string;

  constructor(request: APIRequestContext) {
    super(request);
    this.basePath = pathParameters.cardParameter;
  }
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
}
