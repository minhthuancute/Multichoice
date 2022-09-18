import React, { useState } from 'react';
import FooterDoExam from './FooterDoExam';
import NavQuestion from './NavQuestion';
import ShowQuestion from './ShowQuestion';

const MainDoExam: React.FC = () => {
  const [indexQuestion, setIndexQuestion] = useState<number>(0);

  return (
    <div
      className="relative"
      style={{
        minHeight: 'calc(100vh - 69px)',
      }}
    >
      <div className="container mx-auto pt-10 lg:px-10 flex gap-x-8">
        <div className="w-full xs:px-4 md:px-10 lg:px-0 lg:w-2/3">
          <ShowQuestion
            indexQuestion={indexQuestion}
            setIndexQuestion={setIndexQuestion}
          />
        </div>
        <div className="w-1/3 xs:hidden lg:block">
          <NavQuestion
            indexQuestion={indexQuestion}
            setIndexQuestion={setIndexQuestion}
          />
        </div>
      </div>

      <FooterDoExam />
    </div>
  );
};

export default MainDoExam;
