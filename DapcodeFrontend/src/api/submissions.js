import api from './client';

export const submitCode = async ({ problemSlug, languageId, sourceCode }) => {
  return await api.post('/submissions', {
    problemSlug,
    languageId,
    sourceCode,
  });
};

export const getSubmissionById = async (id) => {
  return await api.get(`/submissions/${id}`);
};

export const subscribeSubmissionStream = (submissionId, { onInit, onProgress, onComplete, onError }) => {
  const token = localStorage.getItem('dapcode_token');
  const url = token
    ? `/api/v1/submissions/${submissionId}/stream?token=${encodeURIComponent(token)}`
    : `/api/v1/submissions/${submissionId}/stream`;

  // Standard EventSource does not support custom Authorization headers directly,
  // but if cookies/same-origin proxy is used, or backend accepts query param / permitAll,
  // EventSource connects smoothly.
  const eventSource = new EventSource(url);

  eventSource.addEventListener('INIT', (event) => {
    if (onInit) onInit(event.data);
  });

  eventSource.addEventListener('TEST_PROGRESS', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onProgress) onProgress(data);
    } catch {
      if (onProgress) onProgress(event.data);
    }
  });

  eventSource.addEventListener('SUBMISSION_COMPLETE', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onComplete) onComplete(data);
    } catch {
      if (onComplete) onComplete(event.data);
    }
    eventSource.close();
  });

  eventSource.addEventListener('ERROR', (event) => {
    if (onError) onError(event.data);
    eventSource.close();
  });

  eventSource.onerror = (err) => {
    if (onError) onError(err);
    eventSource.close();
  };

  return () => {
    eventSource.close();
  };
};
