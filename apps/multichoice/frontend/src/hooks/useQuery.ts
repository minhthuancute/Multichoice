/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams } from 'react-router-dom';

export const useQuery = <T>() => {
  const [params, setSearchParams] = useSearchParams();
  const query = Object.fromEntries([...(params as any)]);

  return [query, setSearchParams] as [T, any];
};
