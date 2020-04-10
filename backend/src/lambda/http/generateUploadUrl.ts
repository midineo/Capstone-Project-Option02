import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { addAttachment, getImageUploadUrl } from '../../businessLogic/todos'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('upload Todo url Processing event: ', event)

  const todoId = event.pathParameters.todoId

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const uploadUrl = getImageUploadUrl(todoId)
  await addAttachment(jwtToken, todoId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }
})

handler.use(cors({
  credentials: true
}))

