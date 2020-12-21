// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  name: 'prod',

  authInfo: {
    clientId: '<%= aadWebClientAppIdProd %>',
    authority: 'https://<%= aadTenantDomainName
 %>.b2clogin.com/<%= aadTenantDomainName
 %>.onmicrosoft.com/<%= aadB2CSignInPolicyName %>',
    consentScopes: [
      'https://graph.microsoft.com/offline_access',
      'https://graph.microsoft.com/openid'
    ],
    protectedResourceMap: new Map<string, string[]>([
      ['<%= prodWebApiUriRoot %>', ['https://<%= aadTenantDomainName
 %>.onmicrosoft.com/<%= aadWebApiAppIdProd %>/user_impersonation']]
    ])
  },

  webApi: {
    url: '<%= prodWebApiUriRoot %>'
  }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
