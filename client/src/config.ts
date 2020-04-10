// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'm7rq2wqaa3'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-3.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-vuh4yyr0.auth0.com',            // Auth0 domain
  clientId: 'crsxmUFxAzNcgLWo49dh8EdR6DR7Yd3e',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
