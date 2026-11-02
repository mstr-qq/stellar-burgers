import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import {
  selectUserData,
  selectUpdateUserError,
  updateUser,
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserData);
  const updateUserError = useSelector(selectUpdateUserError) ?? undefined;

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
  }, [user]);

  const isFormChanged = user
    ? formValue.name !== user.name ||
      formValue.email !== user.email ||
      formValue.password !== ''
    : false;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (!isFormChanged) return;

    void dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        ...(formValue.password ? { password: formValue.password } : {}),
      })
    );
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
