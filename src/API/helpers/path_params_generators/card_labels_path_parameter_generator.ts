/*
https://api.trello.com/1/labels
https://api.trello.com/1/labels/{id}
https://api.trello.com/1/labels/{id}
// For this two paths see file cards_path_generator extended
https://api.trello.com/1/cards/{id}/idLabels <-- this path parameters can be handled in cards path parameters generator
https://api.trello.com/1/cards/{id}/labels <-- this path parameters can be handled in cards path parameters generator
*/

export function generateLabelsURL(paramId?: string): string {
  const baseResourcePath: string = '/1/labels/';
  let pathParams: string = baseResourcePath;

  // SOLUTION With ternary operator
  pathParams = paramId ? `${baseResourcePath}/${paramId}` : `${pathParams}`;

  return pathParams;
}

// RestOperatorSolution
export function generateLabelsURLRest(...pathParams: string[]): string {
  const baseResourcePath: string = '/1/labels/';
  const addedParams = `${baseResourcePath}${pathParams.join('/')}`;

  return addedParams;
}
