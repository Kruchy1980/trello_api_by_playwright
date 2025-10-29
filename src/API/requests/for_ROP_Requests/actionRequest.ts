import { pathParameters } from '@_src/API/utils/path_parameters_utils';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseRequest } from './baseRequest';

export class ActionRequest extends BaseRequest {
  protected readonly basePath: string;

  constructor(request: APIRequestContext) {
    super(request);
    this.basePath = pathParameters.checklistParameter;
  }
  // 'https://api.trello.com/1/actions/{id}?key=APIKey&token=APIToken': GET
  public async getCardCommentAction(
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
