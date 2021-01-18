// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'local dev',

  authInfo: {
    clientId: '<%= aadWebClientAppIdDev %>',
    authority: 'https://<%= aadTenantDomainName %>.b2clogin.com/<%= aadTenantDomainName %>.onmicrosoft.com/<%= aadB2CSignInPolicyName %>',
    consentScopes: [
      'https://graph.microsoft.com/offline_access',
      'https://graph.microsoft.com/openid'
    ],
    protectedResourceMap: new Map<string, string[]>([
      ['https://localhost:5001', ['https://<%= aadTenantDomainName %>.onmicrosoft.com/<%= aadWebApiAppIdDev %>/user_impersonation']]
    ])
  },

  webApi: {
    url: 'https://localhost:5001'
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
