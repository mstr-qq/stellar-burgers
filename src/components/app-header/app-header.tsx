import { AppHeaderUI } from '@ui';

import { selectUserData } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(selectUserData);
  const userName = user ? user.name : '';

  return <AppHeaderUI userName={userName} />;
};
