import { params } from '@_src/API/utils/api_utils';

export interface ParamsDataModel {
  key: typeof params.key; //<-- It equals as we will use "string" type
  token: typeof params.token; //<-- It equals as we will use "string" type
  idChecklist?: string;
  name?: string;
  state?: boolean;
  filter?: string;
  fields?: string;
}

// const updateCheckItemParams = {
//   key: params.key,
//   token: params.token,
//   idChecklist: createdChecklistsIds[1],
//   name: 'Task completed',
//   state: true,
// };

// const getFieldParams = {
//   key: params.key,
//   token: params.token,
//   fields: 'name',
// };

// const stickerParams = {
//   key: params.key,
//   token: params.token,
//   fields: 'id,image,rotate',
// };
