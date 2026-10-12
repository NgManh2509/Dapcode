import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, FlaskConical, Loader2 } from 'lucide-react';
import {
  adminGetProblems,
  getProblemDetail,
  createProblem,
  updateProblem,
  deleteProblem,
  errMsg,
} from '../../api/admin';
import { getProblems, clearProblemsCache } from '../../api/problems';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import DifficultyBadge from '../../components/DifficultyBadge';
import {
  Card,
  PageHeader,
  Field,
  Dialog,
  ConfirmDialog,
  Toggle,
  Pagination,
  Spinner,
  Empty,
  useToast,
  useDebounced,
  inputCls,
  btnPrimary,
  btnGhost,
  iconBtn,
} from '../../components/admin/AdminUi';

const LANGS = [
  { key: 'python', label: 'Python' },
  { key: 'java', label: 'Java' },
  { key: 'cpp', label: 'C++' },
];

const emptyForm = {
  title: '',
  slug: '',
  difficulty: 'Easy',
  category: '',
  timeLimitMs: 2000,
  memoryMb: 256,
  isPublished: true,
  description: '',
  code: { python: '', java: '', cpp: '' },
};

function ProblemEditor({ open, problem, categories, onClose, onSaved }) {
  const toast = useToast();
  const isEdit = Boolean(problem);
  const [form, setForm] = useState(emptyForm);
  const [tab, setTab] = useState('description');
  const [lang, setLang] = useState('python');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTab('description');
    setLang('python');
    if (!problem) {
      setForm(emptyForm);
      return;
    }
    setLoading(true);
    getProblemDetail(problem.slug)
      .then((d) =>
        setForm({
          title: d.title || '',
          slug: d.slug || '',
          difficulty: d.difficulty || 'Easy',
          category: d.category || '',
          timeLimitMs: d.timeLimitMs ?? 2000,
          memoryMb: Math.round((d.memoryLimitKb ?? 262144) / 1024),
          isPublished: undefined,
          description: d.descriptionMarkdown || '',
          code: { python: '', java: '', cpp: '', ...(d.starterCode || {}) },
        })
      )
      .catch((e) => {
        toast.push('error', errMsg(e, 'Không tải được chi tiết bài tập'));
        onClose();
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, problem]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.push('error', 'Tiêu đề và mô tả đề bài là bắt buộc');
      return;
    }
    const starter = {};
    LANGS.forEach((l) => {
      if (form.code[l.key]?.trim()) starter[l.key] = form.code[l.key];
    });
    const body = {
      title: form.title.trim(),
      difficulty: form.difficulty,
      category: form.category.trim() || null,
      descriptionMarkdown: form.description,
      timeLimitMs: Number(form.timeLimitMs) || 2000,
      memoryLimitKb: (Number(form.memoryMb) || 256) * 1024,
      starterCode: Object.keys(starter).length ? JSON.stringify(starter) : null,
      isPublished: form.isPublished,
    };
    if (body.isPublished === undefined) delete body.isPublished;
    setSaving(true);
    try {
      if (isEdit) await updateProblem(problem.id, body);
      else await createProblem({ ...body, isPublished: body.isPublished ?? true, slug: form.slug.trim() || undefined });
      clearProblemsCache();
      toast.push('success', isEdit ? 'Đã cập nhật bài tập' : 'Đã tạo bài tập mới');
      onSaved();
    } catch (e) {
      toast.push('error', errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  const tabCls = (t) =>
    `px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
      tab === t
        ? 'bg-[#F0F0F0] dark:bg-[#333333] font-medium text-[#262626] dark:text-[#EFF1F6]'
        : 'text-neutral-500 hover:text-[#262626] dark:hover:text-[#EFF1F6]'
    }`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="xl"
      title={isEdit ? `Chỉnh sửa: ${problem.title}` : 'Thêm bài tập mới'}
      footer={
        <>
          <button type="button" className={btnGhost} onClick={onClose}>
            Hủy
          </button>
          <button type="button" className={btnPrimary} onClick={save} disabled={saving || loading}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? 'Lưu thay đổi' : 'Tạo bài tập'}
          </button>
        </>
      }
    >
      {loading ? (
        <Spinner label="Đang tải chi tiết bài tập..." />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="md:col-span-2">
              <Field label="Tiêu đề *">
                <input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Two Sum" />
              </Field>
            </div>
            <Field label="Slug" hint={isEdit ? 'Không đổi được slug' : 'Để trống để tự sinh từ tiêu đề'}>
              <input
                className={`${inputCls} ${isEdit ? 'opacity-60' : ''}`}
                value={form.slug}
                disabled={isEdit}
                onChange={(e) => set('slug', e.target.value)}
                placeholder="two-sum"
              />
            </Field>
            <Field label="Độ khó">
              <select className={inputCls} value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </Field>
            <Field label="Chủ đề">
              <input className={inputCls} list="admin-categories" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Arrays & Hashing" />
              <datalist id="admin-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field label="Giới hạn thời gian (ms)">
              <input type="number" min={100} className={inputCls} value={form.timeLimitMs} onChange={(e) => set('timeLimitMs', e.target.value)} />
            </Field>
            <Field label="Giới hạn bộ nhớ (MB)">
              <input type="number" min={16} className={inputCls} value={form.memoryMb} onChange={(e) => set('memoryMb', e.target.value)} />
            </Field>
            <div className="flex items-end pb-2">
              <Toggle
                checked={form.isPublished ?? true}
                onChange={(v) => set('isPublished', v)}
                label={form.isPublished === undefined ? 'Giữ nguyên xuất bản' : form.isPublished ? 'Công khai' : 'Bản nháp'}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 border-b border-[#E6E6E6] pb-2 dark:border-[#3E3E3E]">
            <button type="button" className={tabCls('description')} onClick={() => setTab('description')}>
              Đề bài (Markdown)
            </button>
            <button type="button" className={tabCls('starter')} onClick={() => setTab('starter')}>
              Starter code
            </button>
          </div>

          {tab === 'description' ? (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <textarea
                className={`${inputCls} h-[360px] resize-none font-mono text-[13px] leading-relaxed`}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Viết mô tả đề bài bằng Markdown..."
              />
              <div className="h-[360px] overflow-y-auto rounded-lg border border-[#E6E6E6] p-4 dark:border-[#3E3E3E]">
                {form.description ? (
                  <MarkdownRenderer content={form.description} />
                ) : (
                  <p className="text-sm text-neutral-400">Xem trước sẽ hiển thị ở đây.</p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-2 flex gap-1">
                {LANGS.map((l) => (
                  <button
                    key={l.key}
                    type="button"
                    onClick={() => setLang(l.key)}
                    className={`rounded-full px-3 py-1 text-sm cursor-pointer transition-colors ${
                      lang === l.key ? 'bg-[#262626] text-white dark:bg-[#EFF1F6] dark:text-[#262626]' : 'bg-[#F0F0F0] text-neutral-600 dark:bg-[#333333] dark:text-neutral-300'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <textarea
                className={`${inputCls} h-[320px] resize-none font-mono text-[13px] leading-relaxed`}
                value={form.code[lang]}
                onChange={(e) => set('code', { ...form.code, [lang]: e.target.value })}
                placeholder={`Mã khởi đầu cho ${LANGS.find((l) => l.key === lang).label}...`}
                spellCheck={false}
              />
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}

export default function AdminProblemsPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [editor, setEditor] = useState({ open: false, problem: null });
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const q = useDebounced(search);

  useEffect(() => {
    getProblems({ size: 250 })
      .then((res) => {
        const items = res?.data?.content || res?.content || res?.data || [];
        setCategories([...new Set(items.map((p) => p.category).filter(Boolean))]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPage(0);
  }, [q, difficulty, category]);

  const load = useCallback(() => {
    setLoading(true);
    adminGetProblems({
      page,
      size: 15,
      search: q || undefined,
      difficulty: difficulty || undefined,
      category: category || undefined,
    })
      .then(setData)
      .catch((e) => toast.push('error', errMsg(e, 'Không tải được danh sách bài tập')))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q, difficulty, category]);

  useEffect(() => {
    load();
  }, [load]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteProblem(toDelete.id);
      clearProblemsCache();
      toast.push('success', 'Đã xóa bài tập');
      setToDelete(null);
      load();
    } catch (e) {
      toast.push('error', errMsg(e));
    } finally {
      setDeleting(false);
    }
  };

  const items = data?.content || [];

  return (
    <>
      <PageHeader
        title="Quản lý bài tập"
        subtitle={data ? `${data.totalElements} bài tập trong hệ thống` : ' '}
        actions={
          <button type="button" className={btnPrimary} onClick={() => setEditor({ open: true, problem: null })}>
            <Plus className="h-4 w-4" />
            Thêm bài tập
          </button>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input className={`${inputCls} w-64 pl-9`} placeholder="Tìm theo tiêu đề, slug..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className={`${inputCls} w-auto`} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Mọi độ khó</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select className={`${inputCls} w-auto`} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Mọi chủ đề</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {loading && !data ? (
          <Spinner />
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-y border-[#E6E6E6] text-xs text-neutral-500 dark:border-[#3E3E3E] dark:text-neutral-400">
                <th className="px-5 py-2 font-normal">Tiêu đề</th>
                <th className="hidden px-3 py-2 font-normal md:table-cell">Chủ đề</th>
                <th className="px-3 py-2 font-normal">Độ khó</th>
                <th className="px-5 py-2 text-right font-normal">Thao tác</th>
              </tr>
            </thead>
            <tbody className={loading ? 'opacity-60' : ''}>
              {items.map((p) => (
                <tr key={p.id} className="odd:bg-[#F7F8FA] dark:odd:bg-[#333333]/50">
                  <td className="px-5 py-3">
                    <div className="text-sm font-medium">{p.title}</div>
                    <div className="font-mono text-xs text-neutral-400">{p.slug}</div>
                  </td>
                  <td className="hidden px-3 py-3 text-sm text-neutral-500 md:table-cell dark:text-neutral-400">{p.category}</td>
                  <td className="px-3 py-3">
                    <DifficultyBadge difficulty={p.difficulty} size="xs" />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-0.5">
                      <button type="button" title="Quản lý test case" className={iconBtn} onClick={() => navigate(`/admin/testcases?problemId=${p.id}`)}>
                        <FlaskConical className="h-4 w-4" />
                      </button>
                      <button type="button" title="Chỉnh sửa" className={iconBtn} onClick={() => setEditor({ open: true, problem: p })}>
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" title="Xóa" className={`${iconBtn} hover:!text-[#EF4743]`} onClick={() => setToDelete(p)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !items.length && <Empty>Không có bài tập phù hợp.</Empty>}
        <Pagination page={page} totalPages={data?.totalPages} onChange={setPage} />
      </Card>

      <ProblemEditor
        open={editor.open}
        problem={editor.problem}
        categories={categories}
        onClose={() => setEditor({ open: false, problem: null })}
        onSaved={() => {
          setEditor({ open: false, problem: null });
          load();
        }}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
        title="Xóa bài tập"
        confirmLabel="Xóa"
        message={`Xóa "${toDelete?.title}"? Toàn bộ test case và bài nộp liên quan sẽ bị xóa theo.`}
      />
    </>
  );
}
