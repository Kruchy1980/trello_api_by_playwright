import { ParamsDataModel } from '@_src/API/models/params-data.model';

export function asRecord(
  params: ParamsDataModel,
): Record<string, string | boolean> {
  return params as unknown as Record<string, string | boolean>;
}
