import { AppHeader, IngredientDetails, Modal, OrderInfo, OrderModal } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
} from '../../services/slices/ingredientsSlice';
import { checkUserAuth } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { ProtectedRoute } from '../protected-route/protected-route';

import '../../index.css';

import styles from './app.module.css';

type TBackgroundState = {
  background?: { pathname: string };
};

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const background = (location.state as TBackgroundState | null)?.background;

  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  const handleModalClose = (): void => {
    void navigate(-1);
  };

  if (isIngredientsLoading) {
    return <Preloader />;
  }

  if (ingredientsError) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты: {ingredientsError}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute anonymous>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute anonymous>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute anonymous>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute anonymous>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ingredients/:id"
          element={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <h2 className="text text_type_main-large mt-10 mb-5">
                Детали ингредиента
              </h2>
              <IngredientDetails />
            </div>
          }
        />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/feed/:number"
            element={<OrderModal onClose={handleModalClose} />}
          />

          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <OrderModal onClose={handleModalClose} />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
