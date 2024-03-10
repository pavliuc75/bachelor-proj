import keycloak from "../authentication/keycloak";
import { Configuration, DefaultApi } from "../generated-sources/openapi";

let privateApiConfigurationParameters = {
  basePath: process.env.REACT_APP_BACKEND_URL,
  accessToken: () => keycloak?.token,
};

let publicApiConfigurationParameters = {
  basePath: process.env.REACT_APP_BACKEND_URL,
};

// @ts-ignore
let privateApi = new DefaultApi(new Configuration(privateApiConfigurationParameters));

let publicApi = new DefaultApi(new Configuration(publicApiConfigurationParameters));

export const api = {
  publicApi,
  privateApi,
};
