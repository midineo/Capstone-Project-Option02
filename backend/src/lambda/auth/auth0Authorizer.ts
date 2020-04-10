import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
//import Axios from 'axios'
//import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = '...'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJAZafEb8igOu0MA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi12dWg0eXlyMC5hdXRoMC5jb20wHhcNMjAwNDEwMTMwNzUzWhcNMzMx
MjE4MTMwNzUzWjAhMR8wHQYDVQQDExZkZXYtdnVoNHl5cjAuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu3QVQ7Na4bKdfawFr/UCAG1k
JxRxwJH/X9LzXetXxyeiCKBE1X1cVui5WNjUoIa+Y1B+NHutvxRnqZBmaYwzjZtG
a3CrRmWUuKQbpLZY7uvq8WrpRoLqkLnvOMwyHLtVQ66oU1l4A6csNw2pTePklwjB
l2C7SEX5nKyBkVqUbY3WvHAwAhCdvqFq7Ea0sma7DvQVAJbB7FeIHZPJgayrAWha
57TClQaGRPZBr93kB1J0sGc62JhfXgK5sI40ZyLuukfCUftUUr9TvgYO7GwnbrwR
COc3eiLEuKrwEfme0KoSIiV/OCsAxowWIDusJQhN4qqHBoMfThCi4BeURpHCqQID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSE/97ZEdoot9kcsnOy
kDm1c9+SvDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAIi+vQS0
c7SiApDsBYzH3kO7T6ajJUUANgxCVbpmiCXVyIqUxSBagqHwi2zfkHk8h7dMBGrl
Qvqa3Fzn5M9BLN0JeEyZIP87ykEqi7AKBEP6SXfSIvokOQh3Vft+yL5uXgHi+puS
HDfW1wH19Cjfrvccul1uU3MleMu2takpANOI5J4ch1LOisSLjaM1mPAYqSE7K7H0
GcWIN040itauCzuvJEoTtf221hjCFQ2nl9o7HiuJ92OhBRTGUnDLm4nK22PoaDTR
86FJ6r1FJ6rT54esrIk0Gy/1bhHkmY9zE8XYLomtkHM+w/efDFYmIewmjVX0Nj5W
+NiI+q3hypaVdMQ=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {

  logger.info('Authorizing a user', event.authorizationToken)

  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  //const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
