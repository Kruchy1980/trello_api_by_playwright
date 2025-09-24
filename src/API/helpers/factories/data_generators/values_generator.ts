import { params } from '@_src/API/utils/api_utils';

// Return string or number only
export function returnProperValue(
  currentValue?: string | number,
): string | number {
  const returnedValue: string | number =
    typeof currentValue === 'string'
      ? currentValue
      : typeof currentValue === 'number'
        ? currentValue
        : '';

  return returnedValue;
}
// Return string only
export function returnStringValue(currentStringValue?: string): string {
  const returnedStringValue: string = currentStringValue
    ? currentStringValue
    : '';

  return returnedStringValue;
}

// Return proper params methods
// Key
export function returnAuthKeyValue(parameterValue: string): string {
  const authorizationKey: string = parameterValue ? parameterValue : params.key;
  return authorizationKey;
}
// Token
export function returnAuthTokenValue(parameterValue: string): string {
  const authorizationToken: string = parameterValue
    ? parameterValue
    : params.token;
  return authorizationToken;
}
