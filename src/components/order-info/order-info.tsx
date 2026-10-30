import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useSelector, useDispatch } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectFeedsOrders, selectUserOrders } from '../../services/slices/feedsSlice';
import {
  fetchOrderByNumber,
  selectCurrentOrder,
  selectCurrentOrderRequest,
  selectCurrentOrderError,
  selectOrdersByNumber,
} from '../../services/slices/orderSlice';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const feedsOrders = useSelector(selectFeedsOrders);
  const userOrders = useSelector(selectUserOrders);
  const ordersByNumber = useSelector(selectOrdersByNumber);
  const currentOrder = useSelector(selectCurrentOrder);
  const currentOrderRequest = useSelector(selectCurrentOrderRequest);
  const currentOrderError = useSelector(selectCurrentOrderError);

  const orderNumber = Number(number);

  const orderData = useMemo(() => {
    if (!Number.isFinite(orderNumber)) return null;
    return (
      ordersByNumber[orderNumber] ??
      feedsOrders.find((o) => o.number === orderNumber) ??
      userOrders.find((o) => o.number === orderNumber) ??
      (currentOrder && currentOrder.number === orderNumber ? currentOrder : null)
    );
  }, [orderNumber, ordersByNumber, feedsOrders, userOrders, currentOrder]);

  useEffect(() => {
    if (!Number.isFinite(orderNumber)) return;
    if (orderData) return;
    dispatch(fetchOrderByNumber(orderNumber));
  }, [dispatch, orderNumber, orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    if (currentOrderError) return <p>{currentOrderError}</p>;
    if (currentOrderRequest || !ingredients.length) return <Preloader />;
    return <p>Заказ не найден</p>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};