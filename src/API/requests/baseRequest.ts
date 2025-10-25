import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseRequest {
  protected request: APIRequestContext;
  protected basePath: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.basePath = '';
  }

  // protected buildUrl(basePath: string, ...pathSegments: string[]): string {
  //   return [basePath, ...pathSegments].filter(Boolean).join('/');
  // }
  public buildUrl(...segments: string[]): string {
    return [this.basePath, ...segments].filter(Boolean).join('/');
  }
  // protected buildUrl(basePath: string, ...pathSegments: string[]): string {
  //   // 1. Concatenation of segments with filtering empty values
  //   const rawPath = [basePath, ...pathSegments].filter(Boolean).join('/');
  //   // 2. Removing unnecessary / from path parameters (for path only)
  //   //    => np. /api//users///123 => /api/users/123
  //   const cleanPath = rawPath.replace(/\/{2,}/g, '/');
  //   return cleanPath;
  // }
  async sendRequest(
    method: string,
    url: string,
    options: {
      headers?: Record<string, string>;
      params?: Record<string, string | number | boolean>;
      data?: object;
    } = {},
  ): Promise<APIResponse> {
    const httpMethod = method.toUpperCase();

    switch (httpMethod) {
      case 'GET':
        return this.request.get(url, options);
      case 'POST':
        return this.request.post(url, options);
      case 'PUT':
        return this.request.put(url, options);
      case 'PATCH':
        return this.request.patch(url, options);
      case 'DELETE':
        return this.request.delete(url, options);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}
