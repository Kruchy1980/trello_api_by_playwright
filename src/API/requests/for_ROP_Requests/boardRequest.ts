import { BoardDataModel } from '@_src/API/models/board-data.model';
import { pathParameters } from '@_src/API/utils/path_parameters_utils';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseRequest } from './baseRequest';

export class BoardRequest extends BaseRequest {
  protected readonly basePath: string;

  constructor(request: APIRequestContext) {
    super(request);
    this.basePath = pathParameters.boardParameter;
  }
  //'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken': POST
  public async createBoard(
    data: BoardDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('POST', this.buildUrl(), { headers, params, data });
  }
  // https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken': GET
  public async getBoard(
    id: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('GET', this.buildUrl(id), { headers, params });
  }

  // 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken': PUT
  public async updateBoard(
    id: string,
    data: BoardDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('PUT', this.buildUrl(id), {
      headers,
      params,
      data,
    });
  }
  // 'https://api.trello.com/1/boards/{id}/{field}?key=APIKey&token=APIToken': GET
  public async getBoardElements(
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

  // 'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken': DELETE
  public async deleteBoard(
    id: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('DELETE', this.buildUrl(id), {
      headers,
      params,
    });
  }
  // 'https://api.trello.com/1/boards/{id}/lists?key=APIKey&token=APIToken';: GET <-- for lists on board collection
}
