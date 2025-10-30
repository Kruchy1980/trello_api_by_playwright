/*
https://api.trello.com/1/actions/{id}
*/

export function generateActionsURL(paramId?: string): string {
  const baseResourcePath: string = '/1/actions/';
  let pathParams: string = baseResourcePath;

  // SOLUTION With ternary operator
  pathParams = paramId
    ? `${baseResourcePath}/${paramId}`
    : `${baseResourcePath}`;

  return pathParams;
}

// RestOperatorSolution - for actions only
export function generateActionsURLRest(...pathParams: string[]): string {
  const baseResourcePath: string = '/1/cards/';
  const neededParams = `${baseResourcePath}${pathParams.join('/')}`;

  return neededParams;
}
