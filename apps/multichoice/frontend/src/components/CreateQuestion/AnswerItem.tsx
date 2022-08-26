import React from 'react';
import Checkbox from '../Commons/Checkbox/Checkbox';
import TextArea from '../Commons/TextArea/TextArea';
import ToolTip from '../Commons/ToolTip/ToolTip';
import { MdOutlineClear } from 'react-icons/md';

interface IAnswerItem {
  indexCorrectAnswers?: number;
  registerFieldContent: any;
  registerFieldIsCorrect: any;
  indexAnswer: number;
  indexAscii: number;
  onDeleteAnswer: (index: number) => void;
}

const AnswerItem: React.FC<IAnswerItem> = ({
  indexCorrectAnswers = -1,
  registerFieldContent,
  registerFieldIsCorrect,
  indexAnswer,
  indexAscii,
  onDeleteAnswer,
}) => {
  const getAsciiCode = (): string => {
    const startCharacter = 65; // 'A'
    return String.fromCharCode(startCharacter + indexAscii) + ')';
  };

  const shouldDisableCheckbox = (): boolean => {
    const shouldDisable =
      indexCorrectAnswers !== indexAnswer && indexCorrectAnswers !== -1;
    return shouldDisable;
  };

  return (
    <div className="my-5 last:mb-0 group cursor-pointer">
      <div className="form-group flex">
        <div className="check-correct flex items-start mr-2">
          <ToolTip
            title={
              shouldDisableCheckbox()
                ? 'The question cannot have two correct answers'
                : ''
            }
          >
            <Checkbox
              disable={shouldDisableCheckbox()}
              registerField={registerFieldIsCorrect}
              className="mt-1"
              id={'answers-' + indexAnswer}
            />
          </ToolTip>
          <span className="font-semibold">{getAsciiCode()}</span>
        </div>
        <TextArea
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
