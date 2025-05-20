// HERE IS THE CONFIG FILE FOR ENV VARIABLES SETUP
import 'dotenv/config.js';

import * as dotenv from 'dotenv';

dotenv.config({ override: true });

export function requireEnvVariable(envVariable: string): string {
  const envVariableValue = process.env[envVariable];
  // Error handling
  if (envVariableValue === undefined) {
    throw new Error(`Environment variable ${envVariable} is not set`);
  }
  return envVariableValue;
}

// Prepare the environment variables
export const BASE_URL = requireEnvVariable('BASE_URL');
export const API_KEY = requireEnvVariable('API_KEY');
export const TOKEN = requireEnvVariable('TOKEN');
