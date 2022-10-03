interface IResponseError {
  statusCode: number;
  message: string;
  code: string;
  timesTamp: string;
  path: string;
  method: string;
}

export const ErrorResponse: (
  statusCode: number,
  message: string,
  code: string,
  request: Request
) => IResponseError = (
  statusCode: number,
  message: string,
  code: string,
  request: Request
): IResponseError => {
  return {
    statusCode: statusCode,
    message,
    code,
    timesTamp: new Date().toISOString(),
    path: request.url,
    method: request.method,
  };
};
