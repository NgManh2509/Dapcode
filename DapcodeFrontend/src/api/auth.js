import api from './client';

export const loginWithGoogle = async (idToken) => {
  return await api.post('/auth/google', { idToken });
};

export const getCurrentUser = async () => {
  return await api.get('/users/me');
};
