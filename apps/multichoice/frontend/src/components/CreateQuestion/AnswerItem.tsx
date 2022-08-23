import React, { useState } from 'react';
import Input from '../Commons/Input/Input';

const AnswerItem: React.FC = () => {
  // const [] = useState<>()

  return (
    <div className="mb-5 last:mb-0">
      <Input placeholder="Nhập câu trả lời" />
    </div>
  );
};

export default AnswerItem;
