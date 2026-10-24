import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIsAuthChecked, selectUserData } from '../../services/slices/userSlice';
import { Preloader } from '../ui';

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
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} />;
  }

  if (!anonymous && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
