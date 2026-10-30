import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUserData } from '../../services/slices/userSlice';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(selectUserData);
  const userName = user ? user.name : '';

  return <AppHeaderUI userName={userName} />;
};