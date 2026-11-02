import { Navigate, useLocation } from 'react-router-dom';

import { selectIsAuthChecked, selectUserData } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui';

import type React from 'react';

type TLocationState = {
  from?: { pathname: string };
};

type ProtectedRouteProps = {
  anonymous?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  anonymous = false,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUserData);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (anonymous && user) {
    const state = location.state as TLocationState | null;
    const from = state?.from ?? { pathname: '/' };
    return <Navigate to={from} />;
  }

  if (!anonymous && !user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};
