import { parseTOML } from 'confbox';
import { getPlatformProxy } from 'wrangler';
import { readFile } from './fs.js';

const cfFetch = {
  project: async (projectName, cfApi) => {
    return await retrieve(
      { method: 'get', headers: cfApi.headers },
      `${cfApi.project}/${projectName}`
    );
  },
};

export const sync = {
  /**
   * @param {string} projectName
   */
  checkRemote: async (projectName, cfApi) => {
    try {
      const projects = await cfFetch.project(projectName, cfApi);

      Object.entries(projects.deployment_configs).map((env) => {
        console.log(env);
      });
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  },

  /**
   * @param {string=} environment
   */
  checkLocal: async (environment) => {
    try {
      const local = await getPlatform(environment);
      console.log(local.env);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  },

  /**
   * @param {string} tomlFilePath
   */
  checkWrangler: async (tomlFilePath) => {
    try {
      const confic = await convertTomlToJson(tomlFilePath);
      console.log(confic);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  },
};

/**
 * @param {string=} environment
 */
const getPlatform = async (environment) => {
  try {
    return await getPlatformProxy({ environment: environment });
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};

/**
 * @param {string} projectId
 */
const fetchKVNamespaces = async (projectId) => {
  const response = await retrieve(
    { method: 'get', headers: cfApi.headers },
    `${cfApi.kv_namespace}/${projectId}`
  );

  // const response = await fetch(
  //   `${CLOUDFLARE_API_URL}/accounts/${projectId}/storage/kv/namespaces`,
  //   {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
  //       'Content-Type': 'application/json',
  //     },
  //   }
  // );
  if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  return response.json().then((data) => data.result);
};

const convertTomlToJson = async (filePath) => {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(`Error reading file: ${err.message}`);
      }

      try {
        const jsonData = parseTOML(data);
        resolve(jsonData);
      } catch (parseError) {
        reject(`Error parsing TOML: ${parseError.message}`);
      }
    });
  });
};

const retrieve = async (headers, url) => {
  const response = await fetch(url, headers);
  if (!response.ok) {
    console.log(response);
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json().then((data) => data.result);
};
