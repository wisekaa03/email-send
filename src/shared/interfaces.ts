export interface GraphQLContext {
  // user?: User;
  req: Request;
  res: Response;
}

export const EMAIL_MICROSERVICE = 'EMAIL_MICROSERVICE';
export const EMAIL_MICROSERVICE_SEND = 'send';
