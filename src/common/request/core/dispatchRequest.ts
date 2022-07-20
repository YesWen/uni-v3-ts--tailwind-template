import adapter from '../adapters';
import { HttpRequestConfig } from '@/types/http';

export default <T>(config: HttpRequestConfig) => {
  return adapter<T>(config.config);
};
