import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileCode2, Send, CheckCircle2 } from 'lucide-react';
import { getDashboardStats, errMsg } from '../../api/admin';
import { Card, PageHeader, Spinner, Badge } from '../../components/admin/AdminUi';

const LANGS = { 71: 'Python', 62: 'Java', 54: 'C++' };

const statusTone = (s) => (s === 'ACCEPTED' ? 'green' : s === 'PENDING' || s === 'RUNNING' ? 'orange' : 'red');

const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'vừa xong';
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
};

function Kpi({ icon: Icon, label, value, sub, color }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">{label}</div>
          <div className="mt-1 text-2xl font-semibold text-[#262626] dark:text-[#EFF1F6]">{value}</div>
          <div className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{sub}</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${color}1A`, color }}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
    </Card>
  );
}

function BarChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex h-44 items-end gap-3">
      {data.map((d) => (
        <div key={d.date} className="flex flex-1 flex-col items-center gap-1.5">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">{d.count}</span>
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-[#FFA116] transition-all duration-500"
              style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? 4 : 2, opacity: d.count ? 1 : 0.25 }}
            />
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{d.date.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => setError(errMsg(e, 'Không tải được số liệu thống kê')));
  }, []);

  if (error) return <Card className="p-6 text-sm text-[#EF4743]">{error}</Card>;
  if (!stats) return <Spinner label="Đang tải số liệu..." />;

  const diff = [
    { label: 'Easy', value: stats.easyProblems, color: '#00B8A3' },
    { label: 'Medium', value: stats.mediumProblems, color: '#FFB800' },
    { label: 'Hard', value: stats.hardProblems, color: '#FF375F' },
  ];
  const diffMax = Math.max(1, stats.totalProblems);

  return (
    <>
      <PageHeader title="Tổng quan" subtitle="Số liệu hoạt động của hệ thống LiệtCode." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={Users} label="Học viên" value={stats.totalUsers} sub={`${stats.activeUsers} hoạt động · ${stats.bannedUsers} bị khóa`} color="#3B82F6" />
        <Kpi icon={FileCode2} label="Bài tập" value={stats.totalProblems} sub={`${stats.easyProblems} dễ · ${stats.mediumProblems} vừa · ${stats.hardProblems} khó`} color="#FFA116" />
        <Kpi icon={Send} label="Lượt nộp bài" value={stats.totalSubmissions} sub={`${stats.totalDailySubmissions} trong 7 ngày qua`} color="#8B5CF6" />
        <Kpi icon={CheckCircle2} label="Tỷ lệ Accepted" value={`${stats.acceptedRate}%`} sub="Trên tổng số lượt nộp" color="#2CBB5D" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Lượt nộp bài 7 ngày gần nhất</h2>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{stats.totalDailySubmissions} lượt</span>
          </div>
          <BarChart data={stats.submissionLast7Days || []} />
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold">Bài tập theo độ khó</h2>
          <div className="space-y-4">
            {diff.map((d) => (
              <div key={d.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span style={{ color: d.color }} className="font-medium">
                    {d.label}
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400">{d.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#F0F0F0] dark:bg-[#333333]">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(d.value / diffMax) * 100}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-semibold">Bài nộp gần đây</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-y border-[#E6E6E6] text-xs text-neutral-500 dark:border-[#3E3E3E] dark:text-neutral-400">
              <th className="px-5 py-2 font-normal">Học viên</th>
              <th className="px-3 py-2 font-normal">Bài tập</th>
              <th className="hidden px-3 py-2 font-normal sm:table-cell">Ngôn ngữ</th>
              <th className="px-3 py-2 font-normal">Kết quả</th>
              <th className="px-5 py-2 text-right font-normal">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {(stats.recentSubmission || []).map((s) => (
              <tr key={s.id} className="odd:bg-[#F7F8FA] dark:odd:bg-[#333333]/50">
                <td className="px-5 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-[#FFA116] text-xs font-semibold text-white">
                      {s.userAvatar ? <img src={s.userAvatar} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" /> : s.username?.charAt(0).toUpperCase()}
                    </div>
                    <span>{s.username}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-sm">
                  <Link to={`/problems/${s.problemSlug}`} className="hover:text-[#FFA116]">
                    {s.problemTitle}
                  </Link>
                </td>
                <td className="hidden px-3 py-3 text-sm text-neutral-500 sm:table-cell dark:text-neutral-400">{LANGS[s.languageId] || s.languageId}</td>
                <td className="px-3 py-3">
                  <Badge tone={statusTone(s.status)}>{s.status}</Badge>
                </td>
                <td className="px-5 py-3 text-right text-sm text-neutral-500 dark:text-neutral-400">{timeAgo(s.submittedAt)}</td>
              </tr>
            ))}
            {!(stats.recentSubmission || []).length && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  Chưa có bài nộp nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
