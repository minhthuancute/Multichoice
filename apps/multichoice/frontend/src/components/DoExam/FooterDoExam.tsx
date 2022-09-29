import React from 'react';

const FooterDoExam: React.FC = () => {
  return (
    <footer className="absolute bottom-0 pb-4 px-4 text-center w-full mt-10">
      <p className="text-sm ">
        &copy; 2022 Estates. All rights reserved | Designed by{' '}
        <span className="font-semibold text-primary-900">Multichoice Team</span>
      </p>
    </footer>
  );
};

export default FooterDoExam;
