import neo4j, { Driver, Session } from 'neo4j-driver';
import { config } from '../config/env';

let driver: Driver | null = null;

export function getDriver(): Driver | null {
  if (!driver && config.NEO4J_URI && !config.NEO4J_URI.includes('placeholder')) {
    try {
      driver = neo4j.driver(
        config.NEO4J_URI,
        neo4j.auth.basic(config.NEO4J_USERNAME, config.NEO4J_PASSWORD)
      );
    } catch (error) {
      console.error('Failed to initialize Neo4j Driver:', error);
    }
  }
  return driver;
}

export function getSession(mode: 'READ' | 'WRITE' = 'WRITE'): Session {
  const d = getDriver();
  if (!d) {
    throw new Error('Neo4j Driver not initialized. Check your environment variables.');
  }
  return d.session({
    defaultAccessMode: mode === 'READ' ? neo4j.session.READ : neo4j.session.WRITE,
  });
}

/**
 * Execute a Cypher query and close the session automatically.
 */
export async function runQuery<T = any>(
  query: string,
  params: Record<string, any> = {},
  mode: 'READ' | 'WRITE' = 'WRITE'
): Promise<T[]> {
  const session = getSession(mode);
  try {
    const result = await session.run(query, params);
    // Parse records into plain objects
    return result.records.map((record) => {
      const obj: Record<string, any> = {};
      record.keys.forEach((key) => {
        const value = record.get(key);
        obj[key] = parseNeo4jValue(value);
      });
      return obj as T;
    });
  } finally {
    await session.close();
  }
}

/**
 * Utility to parse Neo4j-specific data types (like Integer) into plain JavaScript types.
 */
function parseNeo4jValue(value: any): any {
  if (value === null || value === undefined) {
    return value;
  }
  
  if (neo4j.isInt(value)) {
    return value.toNumber();
  }
  
  if (Array.isArray(value)) {
    return value.map(parseNeo4jValue);
  }
  
  if (typeof value === 'object') {
    if (value.identity && value.properties) {
      // It's a node or relationship
      return {
        id: parseNeo4jValue(value.identity),
        ...parseNeo4jValue(value.properties),
      };
    }
    
    const parsed: Record<string, any> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        parsed[key] = parseNeo4jValue(value[key]);
      }
    }
    return parsed;
  }
  
  return value;
}

/**
 * Verify connectivity to Neo4j.
 */
export async function verifyConnectivity(): Promise<boolean> {
  const d = getDriver();
  if (!d) return false;
  try {
    await d.verifyConnectivity();
    return true;
  } catch (error) {
    console.error('Neo4j connectivity check failed:', error);
    return false;
  }
}
