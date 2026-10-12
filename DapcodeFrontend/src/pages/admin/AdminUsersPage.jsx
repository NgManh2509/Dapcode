import React, { useEffect, useState, useCallback } from 'react';
import { Search, Shield, ShieldAlert, UserCheck, UserX, AlertTriangle } from 'lucide-react';
import { adminGetUsers, setUserStatus, setUserRole, errMsg } from '../../api/admin';
import {
  Card,
  PageHeader,
  Dialog,
  ConfirmDialog,
  Pagination,
  Spinner,
  Empty,
  Badge,
  useToast,
  useDebounced,
  inputCls,
  btnPrimary,
  btnGhost,
  iconBtn,
} from '../../components/admin/AdminUi';

function StatusDialog({ open, user, onClose, onSaved }) {
  const toast = useToast();
  const [bannedReason, setBannedReason] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setBannedReason('');
  }, [open]);

  if (!user) return null;
  const isBanning = user.active;

  const handleSubmit = async () => {
    if (isBanning && !bannedReason.trim()) {
      toast.push('error', 'Vui lòng nhập lý do khóa tài khoản');
      return;
    }
    setSaving(true);
    try {
      await setUserStatus(user.id, !isBanning, isBanning ? bannedReason.trim() : null);
      toast.push('success', isBanning ? 'Đã khóa tài khoản thành công' : 'Đã mở khóa tài khoản');
      onSaved();
    } catch (e) {
      toast.push('error', errMsg(e, 'Thao tác không thành công'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isBanning ? 'Khóa tài khoản học viên' : 'Mở khóa tài khoản học viên'}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Bạn đang {isBanning ? 'khóa' : 'mở khóa'} tài khoản:{' '}
          <strong className="text-[#262626] dark:text-[#EFF1F6]">
            {user.username} ({user.email})
          </strong>
        </p>

        {isBanning && (
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
              Lý do khóa tài khoản <span className="text-[#EF4743]">*</span>
            </label>
            <textarea
              value={bannedReason}
              onChange={(e) => setBannedReason(e.target.value)}
              placeholder="VD: Vi phạm điều khoản sử dụng, spam bài nộp..."
              rows={3}
              className={inputCls}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-[#E6E6E6] pt-3 dark:border-[#3E3E3E]">
          <button type="button" onClick={onClose} className={btnGhost} disabled={saving}>
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`${btnPrimary} ${isBanning ? '!bg-[#EF4743] hover:!bg-[#D93834]' : ''}`}
            disabled={saving}
          >
            {saving ? 'Đang xử lý...' : isBanning ? 'Khóa tài khoản' : 'Mở khóa'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default function AdminUsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search, 300);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [selectedUser, setSelectedUser] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [roleChangeUser, setRoleChangeUser] = useState(null);
  const [roleChanging, setRoleChanging] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 15,
        search: debouncedSearch.trim() || undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        isActive: statusFilter === 'ACTIVE' ? true : statusFilter === 'BANNED' ? false : undefined,
      };
      const res = await adminGetUsers(params);
      setUsers(res?.content || []);
      setTotalPages(res?.totalPages || 1);
      setTotalElements(res?.totalElements || 0);
    } catch (e) {
      toast.push('error', errMsg(e, 'Không tải được danh sách người dùng'));
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, roleFilter, statusFilter, toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleToggle = async () => {
    if (!roleChangeUser) return;
    const newRole = roleChangeUser.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    setRoleChanging(true);
    try {
      await setUserRole(roleChangeUser.id, newRole);
      toast.push('success', `Đã đổi vai trò sang ${newRole}`);
      setRoleChangeUser(null);
      loadUsers();
    } catch (e) {
      toast.push('error', errMsg(e, 'Không thể cập nhật vai trò'));
    } finally {
      setRoleChanging(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Quản lý học viên & tài khoản"
        description="Tra cứu tài khoản, phân quyền quản trị viên và xử lý vi phạm học viên."
      />

      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                placeholder="Tìm theo username hoặc email..."
                className={`${inputCls} pl-9`}
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(0);
              }}
              className="h-9 rounded-lg border border-[#E6E6E6] bg-white px-3 text-sm text-[#262626] dark:border-[#3E3E3E] dark:bg-[#282828] dark:text-[#EFF1F6]"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="ROLE_USER">Học viên (User)</option>
              <option value="ROLE_ADMIN">Quản trị viên (Admin)</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="h-9 rounded-lg border border-[#E6E6E6] bg-white px-3 text-sm text-[#262626] dark:border-[#3E3E3E] dark:bg-[#282828] dark:text-[#EFF1F6]"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="BANNED">Đã bị khóa</option>
            </select>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Tổng cộng: <strong className="text-[#262626] dark:text-[#EFF1F6]">{totalElements}</strong> tài khoản
          </span>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <Spinner />
          </div>
        ) : users.length === 0 ? (
          <div className="py-12">
            <Empty title="Không tìm thấy tài khoản" description="Thử đổi từ khóa hoặc bộ lọc tìm kiếm." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#E6E6E6] bg-[#F7F8FA] text-xs font-medium text-neutral-500 dark:border-[#3E3E3E] dark:bg-[#202020] dark:text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Học viên</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Ngày tham gia</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6E6] dark:divide-[#3E3E3E]">
                {users.map((u) => {
                  const isAdmin = u.role === 'ROLE_ADMIN';
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-[#F7F8FA] dark:hover:bg-[#303030]/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FFA116] text-xs font-semibold text-white">
                            {u.avatarUrl ? (
                              <img
                                src={u.avatarUrl}
                                alt={u.username}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              (u.username || 'U').charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-[#262626] dark:text-[#EFF1F6]">{u.username}</div>
                            {u.bannedReason && (
                              <div className="flex items-center gap-1 text-[11px] text-[#EF4743]">
                                <AlertTriangle className="h-3 w-3" />
                                <span>{u.bannedReason}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400">{u.email}</td>
                      <td className="px-4 py-3">
                        {isAdmin ? (
                          <Badge tone="orange">
                            <Shield className="mr-1 h-3 w-3" /> ADMIN
                          </Badge>
                        ) : (
                          <Badge tone="gray">USER</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {u.active ? (
                          <Badge tone="green">Hoạt động</Badge>
                        ) : (
                          <Badge tone="red">Bị khóa</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setRoleChangeUser(u)}
                            className={iconBtn}
                            title={isAdmin ? 'Hạ quyền về User' : 'Nâng cấp quyền Admin'}
                          >
                            {isAdmin ? <ShieldAlert className="h-4 w-4 text-[#FFA116]" /> : <Shield className="h-4 w-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(u);
                              setStatusOpen(true);
                            }}
                            className={`${iconBtn} ${
                              u.active
                                ? 'hover:text-[#EF4743] dark:hover:text-[#EF4743]'
                                : 'hover:text-[#2CBB5D] dark:hover:text-[#2CBB5D]'
                            }`}
                            title={u.active ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          >
                            {u.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-3">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </Card>

      <StatusDialog
        open={statusOpen}
        user={selectedUser}
        onClose={() => setStatusOpen(false)}
        onSaved={() => {
          setStatusOpen(false);
          loadUsers();
        }}
      />

      <ConfirmDialog
        open={Boolean(roleChangeUser)}
        title="Thay đổi vai trò người dùng"
        description={`Bạn có chắc muốn đổi vai trò của "${roleChangeUser?.username}" từ ${
          roleChangeUser?.role === 'ROLE_ADMIN' ? 'ADMIN sang USER' : 'USER sang ADMIN'
        }?`}
        confirmLabel="Đổi vai trò"
        loading={roleChanging}
        onConfirm={handleRoleToggle}
        onClose={() => setRoleChangeUser(null)}
      />
    </div>
  );
}
