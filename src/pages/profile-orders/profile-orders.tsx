import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchUserOrders, selectUserOrders } from '../../services/slices/feedsSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    void dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
