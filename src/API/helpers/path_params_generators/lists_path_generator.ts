/* For lists method
https://api.trello.com/1/lists
https://api.trello.com/1/lists/{id}
*/
// Not used just for this project
export function generateListURL(paramId?: string): string {
  const baseResourcePath: string = '/1/lists/';
  let pathParams: string = baseResourcePath;

  // SOLUTION With ternary operator
  pathParams = paramId ? `${baseResourcePath}/${paramId}` : `${pathParams}`;

  return pathParams;
}

// RestOperatorSolution
export function generateListURLRest(...pathParams: string[]): string {
  const baseResourcePath: string = '/1/lists/';
  const neededParams = `${baseResourcePath}${pathParams.join('/')}`;

  return neededParams;
}
