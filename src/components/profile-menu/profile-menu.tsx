import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { logoutUser } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    void dispatch(logoutUser())
      .unwrap()
      .then(() => {
        void navigate('/');
      })
      .catch((err: unknown) => {
        console.error('Ошибка выхода:', err);
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={location.pathname} />;
};
