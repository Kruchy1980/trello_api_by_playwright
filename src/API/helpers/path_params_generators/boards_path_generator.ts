/*
https://api.trello.com/1/boards/
https://api.trello.com/1/boards/{id}
https://api.trello.com/1/boards/{id}/{field}
*/
export function generateBoardURL(paramId?: string, field?: string): string {
  const baseResourcePath: string = '/1/boards/';
  let pathParams: string = baseResourcePath;

  // SOLUTION With ternary operator
  pathParams =
    paramId && field
      ? `${baseResourcePath}/${paramId}/${field}`
      : paramId
        ? `${baseResourcePath}/${paramId}`
        : pathParams;

  return pathParams;
}

// RestOperatorSolution
export function generateBoardURLRest(...pathParams: string[]): string {
  const baseResourcePath: string = '/1/boards/';
  const addedParams = `${baseResourcePath}${pathParams.join('/')}`;

  return addedParams;
}
// RestOperatorSolution Simplified
// export function generatePathURLSimplified(...pathParams: string[]): string {
//   //   const baseResourcePath: string = '/1/boards/';
//   const addedParams = pathParams.join('/');

//   return addedParams;
// }
