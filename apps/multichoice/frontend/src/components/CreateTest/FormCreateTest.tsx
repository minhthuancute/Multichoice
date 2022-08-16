import React from 'react';
import InputCommon from '../Commons/Input/Input';

const FormCreateTest: React.FC = () => {
  return (
    <div className="container">
      <form className="flex items-center gap-x-4">
        <div className="form-left w-1/3 p-4 bg-white rounded-md">
          <InputCommon
            defaultValue={10}
            typeInput="number"
            textLabel="Thời gian làm bài (phút)"
            id="expirationTime"
            isRequired={true}
          />
        </div>
        <div className="form-right w-2/3 p-4 bg-white rounded-md">
          <InputCommon
            textLabel="Tên đề thi"
            id="testName"
            placeholder="Tên đề thi"
            isRequired={true}
          />
        </div>
      </form>
    </div>
  );
};

export default FormCreateTest;
