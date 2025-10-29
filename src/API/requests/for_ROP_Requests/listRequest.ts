import { ListDataModel } from '@_src/API/models/list-data.model';
import { pathParameters } from '@_src/API/utils/path_parameters_utils';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseRequest } from './baseRequest';

export class ListRequest extends BaseRequest {
  protected readonly basePath: string;

  constructor(request: APIRequestContext) {
    super(request);
    this.basePath = pathParameters.listParameter;
  }
  // 'https://api.trello.com/1/lists?name={name}&idBoard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken': POST
  public async createList(
    data: ListDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('POST', this.buildUrl(), { data, params, headers });
  }
  // 'https://api.trello.com/1/lists/{id}/{field}?key=APIKey&token=APIToken' <-- incorrect url no {field in path parameter}: ❌ PUT !!!
  // 'https://api.trello.com/1/lists/{id}?{field}&key=APIKey&token=APIToken' <-- workable endpoint {field in path parameter}: PUT
  public async updateList(
    id: string,
    data: ListDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('PUT', this.buildUrl(id), {
      data,
      params,
      headers,
    });
  }
  // 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken';: GET
  public async getListElements(
    id: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('GET', this.buildUrl(id), {
      params,
      headers,
    });
  }
  // 'https://api.trello.com/1/lists/{id}/closed?key=APIKey&token=APIToken': PUT <-- archive list
  public async archiveList(
    id: string,
    data: ListDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('PUT', this.buildUrl(id), {
      data,
      params,
      headers,
    });
  }

  // 'https://api.trello.com/1/lists/{id}?key=APIKey&token=APIToken': GET <-- get arvhived list <-- as same elements like getListElements
}
