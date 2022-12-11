import React from 'react';
import Checkbox from '../Commons/Checkbox/Checkbox';
import TextArea from '../Commons/TextArea/TextArea';
import ToolTip from '../Commons/ToolTip/ToolTip';
import { MdOutlineClear } from 'react-icons/md';
import {
  UseFieldArrayRemove,
  UseFormClearErrors,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { CreateQuestionDto } from '@monorepo/multichoice/dto';

interface IAnswerItemProps {
  isCorrect?: boolean;
  indexAnswer: number;
  lengthAnswers: number;
  registerFieldContent: UseFormRegisterReturn;
  registerFieldIsCorrect: UseFormRegisterReturn;
  questionType?: QuestionTypeEnum;
  removeAnswer?: UseFieldArrayRemove;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clearErrors?: UseFormClearErrors<CreateQuestionDto>;
  setCorectAnswerSingle?: (indexAnswer: number) => void;
}

const AnswerItem: React.FC<IAnswerItemProps> = ({
  isCorrect = false,
  lengthAnswers,
  registerFieldContent,
  registerFieldIsCorrect,
  indexAnswer,
  questionType = QuestionTypeEnum.SINGLE,
  removeAnswer,
  setCorectAnswerSingle,
  clearErrors,
}) => {
  const getAsciiCode = (): string => {
    const startCharacter = 65;
    return String.fromCharCode(startCharacter + indexAnswer) + ')';
  };

  return (
    <div className="my-5 last:mb-0 group cursor-pointer">
      <div className="form-group flex">
        <div className="check-correct flex items-start mr-2">
          <div>
            {questionType === QuestionTypeEnum.MULTIPLE ? (
              <Checkbox
                registerField={registerFieldIsCorrect}
                defaultChecked={isCorrect}
                className="mt-1"
                id={'answers-' + indexAnswer}
                type="checkbox"
              />
            ) : (
              <div
                onClick={() => {
                  setCorectAnswerSingle && setCorectAnswerSingle(indexAnswer);
                  clearErrors && clearErrors('answers');
                }}
              >
                <Checkbox
                  registerField={registerFieldIsCorrect}
                  defaultChecked={isCorrect}
                  name="correct-answer"
                  className="mt-1"
                  id={'answers-' + indexAnswer}
                  type="radio"
                />
              </div>
            )}
          </div>
          <span className="font-semibold">{getAsciiCode()}</span>
        </div>
        <TextArea
          registerField={registerFieldContent}
          placeholder="Nhập câu trả lời"
          className="flex-1"
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
