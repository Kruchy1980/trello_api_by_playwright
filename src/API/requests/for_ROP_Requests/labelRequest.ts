import { LabelDataModelSimplified } from '@_src/API/models/card_label_new_version_model/card_label_model_simplified';
import { pathParameters } from '@_src/API/utils/path_parameters_utils';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseRequest } from './baseRequest';

export class LabelRequest extends BaseRequest {
  protected readonly basePath: string;

  constructor(request: APIRequestContext) {
    super(request);
    this.basePath = pathParameters.labelParameter;
  }
  // 'https://api.trello.com/1/labels?name={name}&color={color}&idBoard={idBoard}&key=APIKey&token=APIToken';: POST
  public async createLabel(
    data: LabelDataModelSimplified,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('POST', this.buildUrl(), {
      headers,
      params,
      data,
    });
  }
  // 'https://api.trello.com/1/labels?name={name}&color={color}&idBoard={idBoard}&key=APIKey&token=APIToken';: PUT
  public async updateLabel(
    id: string,
    data: LabelDataModelSimplified,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('PUT', this.buildUrl(id), {
      headers,
      params,
      data,
    });
  }
  // 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken': DELETE
  public async deleteLabel(
    id: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('DELETE', this.buildUrl(id), {
      headers,
      params,
    });
  }
  // 'https://api.trello.com/1/labels/{id}?key=APIKey&token=APIToken': GET
  public async getLabel(
    id: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('GET', this.buildUrl(id), {
      headers,
      params,
    });
  }
}
