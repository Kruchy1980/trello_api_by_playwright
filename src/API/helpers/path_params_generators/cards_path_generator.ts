/*
https://api.trello.com/1/cards/{id}
*/

export function generateCardURL(paramId?: string): string {
  const baseResourcePath: string = '/1/cards/';
  let pathParams: string = baseResourcePath;

  // SOLUTION With ternary operator
  pathParams = paramId ? `${baseResourcePath}/${paramId}` : `${pathParams}`;

  return pathParams;
}

/*
https://api.trello.com/1/cards/{id}/actions/{idAction}/comments
https://api.trello.com/1/cards/{id}/actions/comments
https://api.trello.com/1/cards/{id}/actions
https://api.trello.com/1/actions/{id}
*/
// Extended method - could be used in card_comments, labels and stickers -->
// <-- no need to keep functions for card_stickers and card_labels
export function generateCardsExtendedURL(
  paramId?: string,
  action?: string,
  actionId?: string,
  field?: string,
): string {
  const baseResourcePath: string = '/1/cards/';
  let pathParams: string = baseResourcePath;

  // SOLUTION With ternary operator
  pathParams =
    paramId && action && actionId && field
      ? `${baseResourcePath}/${paramId}/${action}/${actionId}/${field}`
      : paramId && action && actionId
        ? `${baseResourcePath}/${paramId}/${action}/${actionId}`
        : paramId && action
          ? `${baseResourcePath}/${paramId}/${action}`
          : paramId
            ? `${baseResourcePath}/${paramId}`
            : `${baseResourcePath}`;

  return pathParams;
}

// These both functions below Not needed for cards in our tests
// Extended method - could be used in card labels tests and Stickers
// https://api.trello.com/1/cards/{id}/idLabels
export function generateCardLabelsExtendedURL(
  paramId?: string,
  field?: string,
): string {
  const baseResourcePath: string = '/1/cards/';
  let pathParams: string = baseResourcePath;

  // SOLUTION With ternary operator
  pathParams =
    paramId && field
      ? `${baseResourcePath}/${paramId}/${field}`
      : paramId
        ? `${baseResourcePath}/${paramId}`
        : `${pathParams}`;

  return pathParams;
}

// Extended method - could be used in cards_stickers tests
/*
https://api.trello.com/1/cards/{id}/stickers/{idSticker}
https://api.trello.com/1/cards/{id}/sticker
*/
// https://api.trello.com/1/cards/{id}/stickers/{idSticker}
export function generateCardStickersExtendedURL(
  paramId?: string,
  field?: string,
  fieldId?: string,
): string {
  const baseResourcePath: string = '/1/cards/';
  let pathParams: string = baseResourcePath;

  // SOLUTION With ternary operator
  pathParams =
    paramId && field && fieldId
      ? `${baseResourcePath}/${paramId}/${field}/${fieldId}`
      : paramId && field
        ? `${baseResourcePath}/${paramId}/${field}`
        : paramId
          ? `${baseResourcePath}/${paramId}`
          : `${pathParams}`;

  return pathParams;
}

// This function can replace each function created for /1/cards - but in project I use the ""simplified_path_parameters_generator
// RestOperatorSolution
export function generateCardURLRest(...pathParams: string[]): string {
  const baseResourcePath: string = '/1/cards/';
  const neededParams = `${baseResourcePath}${pathParams.join('/')}`;

  return neededParams;
}
