import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { loginUser, selectUserError } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const errorText = useSelector(selectUserError) ?? '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (!email || !password) return;

    void dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
