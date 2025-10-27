import CONSTANTS from '@data/Constants';
import { getLocalStorageValue } from '@utils/localstorageutil';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RedirectRoute = ({ children }) => {
  const { isLoggedIn, data } = useSelector(state => state.auth);
  const location = getLocalStorageValue(CONSTANTS.LOCATION);
  if (isLoggedIn && data?.role === 'ADMIN') return <Navigate to={location || '/'} />;
  return children;
};

export default RedirectRoute;
