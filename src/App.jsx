import { RouterProvider } from 'react-router-dom';
import routes from '@routes';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkSession } from '@utils/axiosInstance';
import MainLoader from '@maincomponents/loaders/MainLoader';
import { storeTokens } from '@utils/localstorageutil';
import { forceLogout, setUserLogin } from '@redux/slice/authSlice';
function App() {
  let once = true;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const onceRef = useRef(false);
  async function checkLogin() {
    try {
      const data = await checkSession();
      console.log("Auto-login success:", data);
      storeTokens(data);
      dispatch(setUserLogin(data));
    } catch (error) {
      console.error("Auto-login failed:", error);
      dispatch(forceLogout());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (once) {
     once = false;
      checkLogin();
    }
  }, []);
  return <>{loading ? <MainLoader /> : <RouterProvider router={routes} />}</>;
}
export default App;