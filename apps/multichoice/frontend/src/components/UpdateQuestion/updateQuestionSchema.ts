import * as yup from 'yup';

export const schemaUpdateQuestion = yup.object().shape({
  topicID: yup.number(),
  content: yup
    .string()
    .required('Question content is required')
    .matches(/(^<([^>]+)>)/gi),
  time: yup.number(),
  isActive: yup.boolean(),
  answers: yup.array().of(
    yup.object().shape({
      content: yup.string().required(),
      isCorrect: yup.boolean(),
    })
  ),
});
