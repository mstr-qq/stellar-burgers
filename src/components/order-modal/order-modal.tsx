import { useParams } from 'react-router-dom';

import { Modal } from '../modal/modal';
import { OrderInfo } from '../order-info/order-info';

type TOrderModalProps = {
  onClose: () => void;
};

export const OrderModal = ({ onClose }: TOrderModalProps): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();

  return (
    <Modal title={`#${number}`} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};
