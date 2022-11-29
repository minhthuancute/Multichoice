import React, { useState } from 'react';
import Checkbox from '../Commons/Checkbox/Checkbox';
import TextArea from '../Commons/TextArea/TextArea';
import ToolTip from '../Commons/ToolTip/ToolTip';
import { MdOutlineClear } from 'react-icons/md';
import { UseFormRegisterReturn } from 'react-hook-form';

interface IAnswerItem {
  correctAnswer?: string;
  answerValue?: string;
  checkedValue?: boolean;
  registerFieldContent: UseFormRegisterReturn;
  registerFieldIsCorrect: UseFormRegisterReturn;
  indexAnswer: number;
  indexAscii: number;
  isMultilCorrectAnswer: boolean;
  isCheckedAnswer: boolean;
  onDeleteAnswer: (indexAnswer: number) => void;
}

const AnswerItem: React.FC<IAnswerItem> = ({
  correctAnswer = '',
  answerValue = '',
  registerFieldContent,
  registerFieldIsCorrect,
  indexAnswer,
  indexAscii,
  onDeleteAnswer,
  isMultilCorrectAnswer,
  isCheckedAnswer,
}) => {
  const getAsciiCode = (): string => {
    const startCharacter = 65; // 'A'
    return String.fromCharCode(startCharacter + indexAscii) + ')';
  };

  const shouldDisableCheckbox = (): boolean => {
    if (isMultilCorrectAnswer) return false;
    const shouldDisable = correctAnswer !== answerValue && correctAnswer !== '';
    return shouldDisable || !answerValue;
  };

  return (
    <div className="my-5 last:mb-0 group cursor-pointer">
      <div className="form-group flex">
        <div className="check-correct flex items-start mr-2">
          <ToolTip
            title={
              !answerValue
                ? ''
                : shouldDisableCheckbox()
                ? 'Câu hỏi không thể có hai đáp án đúng'
                : ''
            }
          >
            <Checkbox
              disable={shouldDisableCheckbox()}
              registerField={registerFieldIsCorrect}
              className="mt-1"
              isChecked={isCheckedAnswer}
              id={'answers-' + indexAnswer}
            />
          </ToolTip>
          <span className="font-semibold">{getAsciiCode()}</span>
        </div>
        <TextArea
          key={indexAnswer}
          registerField={registerFieldContent}
          placeholder="Nhập câu trả lời"
          className="flex-1"
          classNameTextarea="h-full"
        />
        <div className="remove ml-3 my-auto">
          <ToolTip title="Xóa câu trả lời">
            <button
              type="button"
              className="text-sm font-semibold bg-red-50 text-red-500
              rounded-full w-6 h-6 flex items-center justify-center"
              onClick={() => onDeleteAnswer(indexAnswer)}
            >
              <MdOutlineClear className="text-tiny" />
            </button>
          </ToolTip>
        </div>
      </div>
    </div>
  );
};

export default AnswerItem;
