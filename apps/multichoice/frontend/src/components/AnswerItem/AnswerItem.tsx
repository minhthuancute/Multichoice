import React from 'react';
import Checkbox from '../Commons/Checkbox/Checkbox';
import TextArea from '../Commons/TextArea/TextArea';
import ToolTip from '../Commons/ToolTip/ToolTip';
import { MdOutlineClear } from 'react-icons/md';
import { UseFieldArrayRemove, UseFormRegisterReturn } from 'react-hook-form';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';

interface IAnswerItemProps {
  indexAnswer: number;
  lengthAnswers: number;
  correctAnswer?: string;
  answerValue?: string;
  registerFieldContent: UseFormRegisterReturn;
  registerFieldIsCorrect: UseFormRegisterReturn;
  questionType?: QuestionTypeEnum;
  removeAnswer?: UseFieldArrayRemove;
}

const AnswerItem: React.FC<IAnswerItemProps> = ({
  lengthAnswers,
  correctAnswer = '',
  answerValue = '',
  registerFieldContent,
  registerFieldIsCorrect,
  indexAnswer,
  questionType = QuestionTypeEnum.SINGLE,
  removeAnswer,
}) => {
  const getAsciiCode = (): string => {
    const startCharacter = 65; // 'A'
    return String.fromCharCode(startCharacter + indexAnswer) + ')';
  };

  const shouldDisableCheckbox = (): boolean => {
    if (questionType === QuestionTypeEnum.MULTIPLE) return false;
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
              registerField={registerFieldIsCorrect}
              key={indexAnswer}
              disable={shouldDisableCheckbox()}
              className="mt-1"
              id={'answers-' + indexAnswer}
              type="checkbox"
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
              onClick={() => {
                if (lengthAnswers - 1 !== 1) {
                  removeAnswer && removeAnswer(indexAnswer);
                }
              }}
            >
              <MdOutlineClear className="text-tiny text-red-500" />
            </button>
          </ToolTip>
        </div>
      </div>
    </div>
  );
};

export default AnswerItem;
