// RestOperatorSolution Simplified
export function generatePathURLSimplified(...pathParams: string[]): string {
  const addedParams = pathParams.join('/');

  return addedParams;
}
