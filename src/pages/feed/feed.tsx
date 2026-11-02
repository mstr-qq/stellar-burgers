import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchFeeds, selectFeedsOrders } from '../../services/slices/feedsSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedsOrders);

  useEffect(() => {
    void dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeeds());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
