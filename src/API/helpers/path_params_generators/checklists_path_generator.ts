/*
https://api.trello.com/1/checklists
https://api.trello.com/1/checklists/{id}
*/

export function generateChecklistListURL(paramId?: string): string {
  const baseResourcePath: string = '/1/cards/';
  let pathParams: string = baseResourcePath;

  // SOLUTION With ternary operator
  pathParams = paramId ? `${baseResourcePath}/${paramId}` : `${pathParams}`;

  return pathParams;
}

// RestOperatorSolution
export function generateChecklistURLRest(...pathParams: string[]): string {
  const baseResourcePath: string = '/1/cards/';
  const neededParams = `${baseResourcePath}${pathParams.join('/')}`;

  return neededParams;
}
