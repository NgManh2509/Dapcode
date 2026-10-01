import api from './client';

export const getAiHint = async ({
  problemSlug,
  code,
  language,
  hintLevel = 1,
  errorMessage = '',
  question = '',
}) => {
  return await api.post('/ai/hint', {
    problem_slug: problemSlug,
    code,
    language,
    hint_level: hintLevel,
    error_message: errorMessage,
    question,
  });
};
