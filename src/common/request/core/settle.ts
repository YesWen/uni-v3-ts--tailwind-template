/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
import { HttpResponse } from '@/types/http';

export default function settle(resolve: any, reject: any, response: HttpResponse) {
  const validateStatus = response.config.validateStatus;
  const status = response.statusCode;
  if (status && (!validateStatus || validateStatus(status))) {
    resolve(response);
  } else {
    reject(response);
  }
}
