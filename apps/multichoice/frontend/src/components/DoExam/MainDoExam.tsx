import React, { useState } from 'react';
import NavQuestion from './NavQuestion';
import ShowQuestion from './ShowQuestion';

const MainDoExam: React.FC = () => {
  const [indexQuestion, setIndexQuestion] = useState<number>(0);

  return (
    <div>
      <div className="max-w-[1200px] mx-auto flex mt-10">
        <div className="w-2/3">
          <ShowQuestion
            indexQuestion={indexQuestion}
            setIndexQuestion={setIndexQuestion}
          />
        </div>
        <div className="w-1/3">
          <NavQuestion
            indexQuestion={indexQuestion}
            setIndexQuestion={setIndexQuestion}
          />
        </div>
      </div>
    </div>
  );
};

export default MainDoExam;
