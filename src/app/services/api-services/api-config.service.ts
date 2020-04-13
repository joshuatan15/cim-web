import { environment } from './../../../environments/environment';
const LOOPBACK_URL: string = environment.apiUrl.hostUrl;


export interface ApiUrl {
  customer: string;
}

export const API_URL: ApiUrl = {
  customer: LOOPBACK_URL + environment.apiUrl.apiPath.customer,
};
