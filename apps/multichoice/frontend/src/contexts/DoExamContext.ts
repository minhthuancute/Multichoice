import React from 'react';
import { IPayloadStartExam } from '../services/Exam/type';

export interface IDoExamContext {
  startExam?: (payload: IPayloadStartExam) => void;
  handleSubmitExam: () => void;
}

export const doExamContext = React.createContext<IDoExamContext>(
  {} as IDoExamContext
);

export const DoExamProvider = doExamContext.Provider;
