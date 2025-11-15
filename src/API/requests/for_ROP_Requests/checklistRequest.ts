import { ChecklistDataModel } from '@_src/API/models/checklist-data.model';
import { pathParameters } from '@_src/API/utils/path_parameters_utils';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseRequest } from './baseRequest';

export class ChecklistRequest extends BaseRequest {
  protected readonly basePath: string;

  constructor(request: APIRequestContext) {
    super(request);
    this.basePath = pathParameters.checklistParameter;
  }
  // CHECKLISTS
  // 'https://api.trello.com/1/checklists?idCard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken';: POST
  public async createCheckList(
    data: ChecklistDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('POST', this.buildUrl(), {
      headers,
      params,
      data,
    });
  }
  // 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken': GET
  public async getCheckList(
    id: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('GET', this.buildUrl(id), {
      headers,
      params,
    });
  }
  // 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken': PUT
  public async updateCheckList(
    id: string,
    data: ChecklistDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('PUT', this.buildUrl(id), {
      headers,
      params,
      data,
    });
  }
  // 'https://api.trello.com/1/checklists/{id}/{field}?value={value}&key=APIKey&token=APIToken': PUT
  public async updateCheckListField(
    id: string,
    field: string,
    data: ChecklistDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('PUT', this.buildUrl(id, field), {
      headers,
      params,
      data,
    });
  }
  // 'https://api.trello.com/1/checklists/{id}/{field}?key=APIKey&token=APIToken';: GET
  public async getCheckListField(
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
  // 'https://api.trello.com/1/checklists/{id}?key=APIKey&token=APIToken': DELETE
  public async deleteCheckList(
    id: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('DELETE', this.buildUrl(id), {
      headers,
      params,
    });
  }

  // CHECKITEMS
  //'https://api.trello.com/1/checklists/{id}/checkItems?name={name}&key=APIKey&token=APIToken: POST
  public async createCheckItem(
    id: string,
    field: string,
    data: ChecklistDataModel,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('POST', this.buildUrl(id, field), {
      headers,
      params,
      data,
    });
  }
  //https://api.trello.com/1/checklists/{id}/checkItems?key=APIKey&token=APIToken: GET
  public async getCheckItemFromChecklist(
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
  // https://api.trello.com/1/checklists/{id}/checkItems/{idCheckItem}?key=APIKey&token=APIToken: DELETE
  public async deleteCheckItemFromChecklist(
    idMain: string,
    element: string,
    elementId: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest(
      'DELETE',
      this.buildUrl(idMain, element, elementId),
      {
        headers,
        params,
      },
    );
  }
  // https://api.trello.com/1/checklists/{id}/checkItems/{idCheckItem}?key=APIKey&token=APIToken: GET
  public async getExactCheckItemFromChecklist(
    idMain: string,
    element: string,
    elementId: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('GET', this.buildUrl(idMain, element, elementId), {
      headers,
      params,
    });
  }
}
