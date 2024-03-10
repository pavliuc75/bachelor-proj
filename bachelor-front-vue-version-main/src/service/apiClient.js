import { Configuration } from "@/generated-sources/openapi/configuration";
import { DefaultApi } from "@/generated-sources/openapi/api";
import Vue from "vue";

let privateApiConfigurationParameters = {
  basePath: "http://localhost:8000",
  accessToken: () => Vue.$keycloak?.token
};

let publicApiConfigurationParameters = {
  basePath: "http://localhost:8000"
};

let privateApi = new DefaultApi(new Configuration(privateApiConfigurationParameters));

let publicApi = new DefaultApi(new Configuration(publicApiConfigurationParameters));

export const api = {
  publicApi,
  privateApi
};
