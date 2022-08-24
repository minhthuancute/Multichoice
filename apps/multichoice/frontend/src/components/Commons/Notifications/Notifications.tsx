import React from 'react';
import ReactDOM from 'react-dom';

interface INotifications {
  title?: string;
  content: string;
}

const Notifications: React.FC<INotifications> = ({ title, content }) => {
  return ReactDOM.createPortal(
    <div className="fixed z-50 right-4 top-4">
      <div
        className="max-w-xs w-full py-4 border-l-2 border-solid rounded-md
      border-violet-600 text-white
    "
      >
        <p>{content}</p>
      </div>
    </div>,
    document.getElementById('noti-root') || ({} as HTMLDivElement)
  );
};

export default Notifications;
