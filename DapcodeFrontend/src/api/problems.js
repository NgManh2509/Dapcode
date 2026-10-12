import api from './client';

let problemsCache = null;

export const clearProblemsCache = () => {
  problemsCache = null;
};

export const getProblems = async (params = {}) => {
  const isDefault =
    !params.page &&
    (!params.size || params.size === 250) &&
    !params.category &&
    !params.difficulty &&
    !params.query;

  if (isDefault && problemsCache) {
    return problemsCache;
  }

  const res = await api.get('/problems', {
    params: {
      size: 250,
      ...params,
    },
  });

  if (isDefault) {
    problemsCache = res;
  }

  return res;
};

export const getProblemBySlug = async (slug) => {
  return await api.get(`/problems/${slug}`);
};
