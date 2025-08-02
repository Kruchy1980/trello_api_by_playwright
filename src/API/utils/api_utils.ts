import { API_KEY, TOKEN } from '@_config/env.config';

export const headers: { [key: string]: string } = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
export const params: { [key: string]: string } = { key: API_KEY, token: TOKEN };
