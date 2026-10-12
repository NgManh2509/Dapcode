import api from './client';

const unwrap = (res) => res?.data ?? res;

export const errMsg = (err, fallback = 'Đã có lỗi xảy ra') =>
  err?.response?.data?.message || err?.message || fallback;

const normUser = (u) => ({ ...u, active: u.active ?? u.isActive ?? true });
const normCase = (t) => ({ ...t, hidden: t.hidden ?? t.isHidden ?? false });
const normTheory = (t) => ({ ...t, published: t.published ?? t.isPublished ?? true });
const normPage = (p, fn) => ({ ...p, content: (p?.content || []).map(fn || ((x) => x)) });

export const getDashboardStats = async () => unwrap(await api.get('/admin/dashboard/stats'));

export const adminGetProblems = async (params) => unwrap(await api.get('/admin/problems', { params }));
export const getProblemDetail = async (slug) => unwrap(await api.get(`/problems/${slug}`));
export const createProblem = async (body) =>
  unwrap(await api.post('/admin/problems', { ...body, published: body.isPublished }));
export const updateProblem = async (id, body) => unwrap(await api.put(`/admin/problems/${id}`, body));
export const deleteProblem = async (id) => unwrap(await api.delete(`/admin/problems/${id}`));

export const getTestCases = async (problemId) => {
  const list = unwrap(await api.get(`/admin/problems/${problemId}/testcases`));
  return (list || []).map(normCase);
};
export const createTestCase = async (problemId, t) =>
  normCase(
    unwrap(
      await api.post(`/admin/problems/${problemId}/testcases`, {
        inputData: t.inputData,
        expectedOutput: t.expectedOutput,
        hidden: t.hidden,
        isHidden: t.hidden,
      })
    )
  );
export const createTestCasesBatch = async (problemId, list) =>
  unwrap(
    await api.post(`/admin/problems/${problemId}/testcases/batch`, {
      testCases: list.map((t) => ({
        inputData: t.inputData,
        expectedOutput: t.expectedOutput,
        hidden: !!t.hidden,
        isHidden: !!t.hidden,
      })),
    })
  );
export const updateTestCase = async (id, t) =>
  normCase(
    unwrap(
      await api.put(`/admin/testcases/${id}`, {
        inputData: t.inputData,
        expectedOutput: t.expectedOutput,
        hidden: t.hidden,
        isHidden: t.hidden,
      })
    )
  );
export const deleteTestCase = async (id) => unwrap(await api.delete(`/admin/testcases/${id}`));

export const adminGetTheories = async (category) => {
  const list = unwrap(await api.get('/admin/theories', { params: category ? { category } : {} }));
  return (list || []).map(normTheory);
};
export const createTheory = async (t) =>
  normTheory(unwrap(await api.post('/admin/theories', { ...t, published: t.isPublished })));
export const updateTheory = async (id, t) => normTheory(unwrap(await api.put(`/admin/theories/${id}`, t)));
export const deleteTheory = async (id) => unwrap(await api.delete(`/admin/theories/${id}`));

export const adminGetUsers = async (params) =>
  normPage(unwrap(await api.get('/admin/users', { params })), normUser);
export const setUserStatus = async (id, active, bannedReason) =>
  normUser(unwrap(await api.put(`/admin/users/${id}/status`, { active, isActive: active, bannedReason })));
export const setUserRole = async (id, role) =>
  normUser(unwrap(await api.put(`/admin/users/${id}/role`, { role })));
