import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NEO4J_URI: process.env.NEO4J_URI || '',
  NEO4J_USERNAME: process.env.NEO4J_USERNAME || '',
  NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};

export function validateConfig() {
  const missing = [];
  if (!config.NEO4J_URI || config.NEO4J_URI.includes('placeholder')) missing.push('NEO4J_URI');
  if (!config.NEO4J_USERNAME || config.NEO4J_USERNAME === 'placeholder') missing.push('NEO4J_USERNAME');
  if (!config.NEO4J_PASSWORD || config.NEO4J_PASSWORD === 'placeholder') missing.push('NEO4J_PASSWORD');

  if (missing.length > 0) {
    console.warn(`[WARNING] Missing Neo4j environment variables: ${missing.join(', ')}. The backend will start, but database operations will fail or run in fallback mode.`);
    return false;
  }
  return true;
}
