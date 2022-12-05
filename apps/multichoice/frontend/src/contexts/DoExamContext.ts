import React from 'react';

export interface IDoExamContext {
  handleSubmitExam: () => void;
}

export const doExamContext = React.createContext<IDoExamContext>(
  {} as IDoExamContext
);

export const DoExamProvider = doExamContext.Provider;
