import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import {
  adminGetTheories,
  createTheory,
  updateTheory,
  deleteTheory,
  errMsg,
} from '../../api/admin';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import {
  Card,
  PageHeader,
  Field,
  Dialog,
  ConfirmDialog,
  Toggle,
  Spinner,
  Empty,
  Badge,
  useToast,
  inputCls,
  btnPrimary,
  btnGhost,
  iconBtn,
} from '../../components/admin/AdminUi';

const emptyForm = {
  title: '',
  slug: '',
  category: '',
  summary: '',
  content: '',
  orderIndex: 0,
  isPublished: true,
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function TheoryEditor({ open, theory, onClose, onSaved }) {
  const toast = useToast();
  const isEdit = Boolean(theory);
  const [form, setForm] = useState(emptyForm);
  const [tab, setTab] = useState('edit');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTab('edit');
    if (theory) {
      setForm({
        title: theory.title || '',
        slug: theory.slug || '',
        category: theory.category || '',
        summary: theory.summary || '',
        content: theory.content || '',
        orderIndex: theory.orderIndex ?? 0,
        isPublished: theory.published ?? true,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, theory]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (val) => {
    setForm((f) => ({
      ...f,
      title: val,
      slug: !isEdit && (!f.slug || f.slug === slugify(f.title)) ? slugify(val) : f.slug,
    }));
  };

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.push('error', 'Tiêu đề và nội dung bài học là bắt buộc');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: (form.slug.trim() || slugify(form.title)).toLowerCase(),
        category: form.category.trim() || 'General',
        summary: form.summary.trim(),
        content: form.content,
        orderIndex: Number(form.orderIndex) || 0,
        isPublished: form.isPublished,
      };
      if (isEdit) {
        await updateTheory(theory.id, payload);
        toast.push('success', 'Đã cập nhật bài học');
      } else {
        await createTheory(payload);
        toast.push('success', 'Đã tạo bài học mới');
      }
      onSaved();
    } catch (e) {
      toast.push('error', errMsg(e, 'Không thể lưu bài học'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? 'Chỉnh sửa bài học lý thuyết' : 'Tạo bài học lý thuyết mới'}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Tiêu đề" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="VD: Binary Search Toàn Tập"
              className={inputCls}
            />
          </Field>
          <Field label="Slug URL" required hint="Định danh duy nhất trên thanh địa chỉ">
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              placeholder="binary-search-toan-tap"
              className={inputCls}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Chuyên mục" required>
            <input
              type="text"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              placeholder="VD: Search, Dynamic Programming"
              className={inputCls}
            />
          </Field>
          <Field label="Thứ tự hiển thị (Order)">
            <input
              type="number"
              value={form.orderIndex}
              onChange={(e) => set('orderIndex', e.target.value)}
              className={inputCls}
            />
          </Field>
          <div className="flex items-center pt-6">
            <Toggle
              checked={form.isPublished}
              onChange={(v) => set('isPublished', v)}
              label="Công khai cho học viên"
            />
          </div>
        </div>

        <Field label="Tóm tắt ngắn (Summary)">
          <textarea
            value={form.summary}
            onChange={(e) => set('summary', e.target.value)}
            rows={2}
            placeholder="Mô tả ngắn gọn nội dung bài học..."
            className={inputCls}
          />
        </Field>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
              Nội dung bài học (Markdown) <span className="text-[#EF4743]">*</span>
            </label>
            <div className="flex rounded-md border border-[#E6E6E6] bg-[#F7F8FA] p-0.5 text-xs dark:border-[#3E3E3E] dark:bg-[#202020]">
              <button
                type="button"
                onClick={() => setTab('edit')}
                className={`rounded px-2.5 py-1 ${
                  tab === 'edit'
                    ? 'bg-white font-medium text-[#262626] shadow-sm dark:bg-[#333] dark:text-[#EFF1F6]'
                    : 'text-neutral-500 hover:text-[#262626] dark:text-neutral-400 dark:hover:text-[#EFF1F6]'
                }`}
              >
                Soạn thảo
              </button>
              <button
                type="button"
                onClick={() => setTab('preview')}
                className={`rounded px-2.5 py-1 ${
                  tab === 'preview'
                    ? 'bg-white font-medium text-[#262626] shadow-sm dark:bg-[#333] dark:text-[#EFF1F6]'
                    : 'text-neutral-500 hover:text-[#262626] dark:text-neutral-400 dark:hover:text-[#EFF1F6]'
                }`}
              >
                Xem trước
              </button>
            </div>
          </div>

          {tab === 'edit' ? (
            <textarea
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              rows={12}
              placeholder="# Hướng dẫn lý thuyết..."
              className={`${inputCls} font-mono text-xs leading-relaxed`}
            />
          ) : (
            <div className="min-h-[280px] max-h-[420px] overflow-y-auto rounded-lg border border-[#E6E6E6] bg-white p-4 dark:border-[#3E3E3E] dark:bg-[#202020]">
              <MarkdownRenderer content={form.content || '*Chưa có nội dung soạn thảo*'} />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#E6E6E6] pt-3 dark:border-[#3E3E3E]">
          <button type="button" onClick={onClose} className={btnGhost} disabled={saving}>
            Hủy
          </button>
          <button type="button" onClick={save} className={btnPrimary} disabled={saving}>
            {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default function AdminTheoriesPage() {
  const toast = useToast();
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [editItem, setEditItem] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadTheories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGetTheories();
      setTheories(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.push('error', errMsg(e, 'Không tải được danh sách bài giảng'));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadTheories();
  }, [loadTheories]);

  const categories = ['ALL', ...Array.from(new Set(theories.map((t) => t.category).filter(Boolean)))];

  const filtered = theories.filter((t) => {
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (t.title || '').toLowerCase().includes(q) ||
        (t.slug || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteTheory(deleteId);
      toast.push('success', 'Đã xóa bài giảng');
      setDeleteId(null);
      loadTheories();
    } catch (e) {
      toast.push('error', errMsg(e, 'Không thể xóa bài giảng'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Quản lý bài giảng lý thuyết"
        description="Thêm mới, cập nhật nội dung markdown và quản lý trạng thái hiển thị lý thuyết."
        action={
          <button
            type="button"
            onClick={() => {
              setEditItem(null);
              setEditorOpen(true);
            }}
            className={btnPrimary}
          >
            <Plus className="h-4 w-4" />
            <span>Tạo bài học</span>
          </button>
        }
      />

      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm bài học theo tiêu đề, slug..."
                className={`${inputCls} pl-9`}
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-lg border border-[#E6E6E6] bg-white px-3 text-sm text-[#262626] dark:border-[#3E3E3E] dark:bg-[#282828] dark:text-[#EFF1F6]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'Tất cả chủ đề' : c}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Tổng cộng: <strong className="text-[#262626] dark:text-[#EFF1F6]">{filtered.length}</strong> bài học
          </span>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12">
            <Empty title="Chưa có bài giảng nào" description="Nhấn Tạo bài học để bắt đầu viết nội dung mới." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#E6E6E6] bg-[#F7F8FA] text-xs font-medium text-neutral-500 dark:border-[#3E3E3E] dark:bg-[#202020] dark:text-neutral-400">
                <tr>
                  <th className="px-4 py-3">STT</th>
                  <th className="px-4 py-3">Tiêu đề bài học</th>
                  <th className="px-4 py-3">Chủ đề</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6E6] dark:divide-[#3E3E3E]">
                {filtered.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className="hover:bg-[#F7F8FA] dark:hover:bg-[#303030]/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-neutral-400">{item.orderIndex ?? idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-[#262626] dark:text-[#EFF1F6]">
                      <div className="max-w-md truncate">{item.title}</div>
                      {item.summary && (
                        <div className="max-w-md truncate text-xs text-neutral-400">{item.summary}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-[#F0F0F0] px-2 py-0.5 text-xs text-neutral-600 dark:bg-[#333333] dark:text-neutral-300">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                      {item.slug}
                    </td>
                    <td className="px-4 py-3">
                      {item.published ? (
                        <Badge tone="green">
                          <Eye className="mr-1 h-3 w-3" /> Công khai
                        </Badge>
                      ) : (
                        <Badge tone="red">
                          <EyeOff className="mr-1 h-3 w-3" /> Bản nháp
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditItem(item);
                            setEditorOpen(true);
                          }}
                          className={iconBtn}
                          title="Chỉnh sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(item.id)}
                          className={`${iconBtn} hover:text-[#EF4743] dark:hover:text-[#EF4743]`}
                          title="Xóa bài học"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <TheoryEditor
        open={editorOpen}
        theory={editItem}
        onClose={() => setEditorOpen(false)}
        onSaved={() => {
          setEditorOpen(false);
          loadTheories();
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Xác nhận xóa bài học lý thuyết"
        description="Hành động này không thể hoàn tác. Học viên sẽ không thể xem nội dung bài giảng này nữa."
        confirmLabel="Xóa bài học"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
