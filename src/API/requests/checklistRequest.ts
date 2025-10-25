import { pathParameters } from '@_src/API/utils/path_parameters_utils';
import { APIRequestContext } from '@playwright/test';
import { BaseRequest } from './baseRequest';

export class ChecklistRequest extends BaseRequest {
  protected readonly basePath: string;

  constructor(request: APIRequestContext) {
    super(request);
    // this.basePath = '/1/checklists'; //<-- Solution I - direct path parameter assigning
    this.basePath = pathParameters.checklistParameter; // <-- Solution II - object usage
  }

  // public buildUrl(...segments: string[]): string {
  //   return [this.basePath, ...segments].filter(Boolean).join('/');
  // }
}
