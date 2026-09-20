import { useSelector } from 'react-redux';

const useToken = () => {
  return useSelector((state) => state.user?.userId ?? null);
};

export default useToken;
