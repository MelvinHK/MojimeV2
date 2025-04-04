import * as kaiApi from './kaiApi';
import * as paheApi from './paheApi';

export enum PROVIDERS {
  KAI = "kai",
  PAHE = "pahe"
}

function getApiClient(source: PROVIDERS) {
  if (source === PROVIDERS.KAI)
    return kaiApi;

  return paheApi;
}

export default getApiClient;