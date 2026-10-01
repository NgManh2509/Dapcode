import api from './client';

let allTheoriesCache = null;
let theoryCategoriesCache = null;

export const getTheories = async (category) => {
  if (!category && allTheoriesCache) {
    return allTheoriesCache;
  }

  const res = await api.get('/theories', {
    params: category ? { category } : {},
  });

  if (!category) {
    allTheoriesCache = res;
  }

  return res;
};

export const getTheoryCategories = async () => {
  if (theoryCategoriesCache) {
    return theoryCategoriesCache;
  }

  const res = await api.get('/theories/categories');
  theoryCategoriesCache = res;
  return res;
};

export const getTheoryBySlug = async (slug) => {
  return await api.get(`/theories/${slug}`);
};
