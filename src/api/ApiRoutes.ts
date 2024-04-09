import ApiRoutes from '@/api/ApiRoutes.json';

export function apiRoute(api: string, urlParams?: any) {
  let getApi: string = ApiRoutes[api];
  if (urlParams !== undefined && urlParams.length > 0) {
    for (const i in urlParams) {
      const index = '$' + i.toString();
      getApi = getApi.replace(index, window.encodeURIComponent(urlParams[i]));
    }
  }
  return process.env.VUE_APP_BASE_API + getApi;
}
