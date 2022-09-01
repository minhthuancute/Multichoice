import { iNotification, Store } from 'react-notifications-component';

export const notify = ({
  title = '',
  message = '',
  type = 'success',
}: iNotification) => {
  Store.addNotification({
    title: title,
    message: message,
    type: type,
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 1500,
      onScreen: true,
    },
  });
};
