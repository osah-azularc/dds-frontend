import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BroadcastChannel } from 'broadcast-channel';
import { createSessionAuth } from './auth/useAuthSession';
import { createAdminAuth } from './auth/useAuthAdmin';
import { createAccountAuth } from './auth/useAuthAccount';

const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutChannelRef = useRef(null);

  if (!logoutChannelRef.current) {
    logoutChannelRef.current = new BroadcastChannel('logout');
  }

  const logoutChannel = logoutChannelRef.current;

  useEffect(() => {
    return () => {
      logoutChannelRef.current?.close();
      //Added for proper logout functionality during local development.
      logoutChannelRef.current = null;
    };
  }, []);

  const sessionAuth = createSessionAuth({ navigate, dispatch, logoutChannel });
  const adminAuth = createAdminAuth();
  const accountAuth = createAccountAuth();

  return {
    ...sessionAuth,
    ...adminAuth,
    ...accountAuth,
    logoutChannel,
  };
};

export default useAuth;
