import { pathParameters } from '@_src/API/utils/path_parameters_utils';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseRequest } from './baseRequest';

export class MemberRequest extends BaseRequest {
  protected readonly basePath: string;

  constructor(request: APIRequestContext) {
    super(request);
    this.basePath = pathParameters.memberParameter;
  }
  public async verifyCredentials(
    field: string,
    boardValue: string,
    params: Record<string, string | boolean>,
    headers: Record<string, string>,
  ): Promise<APIResponse> {
    return this.sendRequest('GET', this.buildUrl(field, boardValue), {
      headers,
      params,
    });
  }
}
