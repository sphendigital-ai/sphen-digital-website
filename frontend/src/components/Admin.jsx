import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Search, Download, Trash2, RefreshCw, Loader2, Users, Calendar, TrendingUp, Inbox } from "lucide-react";
import { toast } from "sonner";
import { adminLogin, adminMe, getAdminLeads, getAdminStats, updateLeadStatus, deleteLeadApi, exportLeadsCsv } from "../lib/api";

const STATUSES = ["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"];
const STATUS_COLORS = {
    New: "bg-sphen-purple/25 text-sphen-purple border-sphen-purple/40",
    Contacted: "bg-sky-400/15 text-sky-300 border-sky-400/30",
    "Meeting Scheduled": "bg-amber-400/15 text-amber-300 border-amber-400/30",
    "Proposal Sent": "bg-sphen-orange/15 text-sphen-orange border-sphen-orange/30",
    Won: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    Lost: "bg-rose-400/15 text-rose-300 border-rose-400/30",
};

const inputCls = "rounded-2xl bg-white/[0.05] border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-sphen-purple transition-colors";

const formatError = (detail) => {
    if (!detail) return "Something went wrong.";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((e) => e?.msg || "").filter(Boolean).join(" ");
    return String(detail);
};

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const { data } = await adminLogin(email, password);
            localStorage.setItem("sphen_admin_token", data.token);
            onLogin(data.email);
        } catch (err) {
            setError(formatError(err.response?.data?.detail));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-5 relative overflow-hidden">
            <div className="absolute w-[500px] h-[500px] rounded-full bg-sphen-purple/15 blur-[150px]" />
            <motion.form
                data-testid="admin-login-form"
                onSubmit={submit}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative glass-strong rounded-[28px] p-8 w-full max-w-sm"
            >
                <div className="flex flex-col items-center mb-7">
                    <img src="/assets/s-logo.png" alt="SPHEN" className="w-16 h-auto mb-3" />
                    <h1 className="font-display text-2xl font-extrabold text-white">Admin Login</h1>
                    <p className="text-sm text-white/45 mt-1">SPHEN DIGITAL Lead Manager</p>
                </div>
                <div className="flex flex-col gap-3">
                    <input data-testid="admin-email-input" type="email" required placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls + " w-full"} />
                    <input data-testid="admin-password-input" type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls + " w-full"} />
                    {error && <p data-testid="admin-login-error" className="text-sm text-rose-400">{error}</p>}
                    <button data-testid="admin-login-submit" disabled={loading} className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sphen-purple to-[#8b5cf6] py-3.5 text-sm font-bold text-white glow-purple hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-60">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : "Login"}
                    </button>
                </div>
            </motion.form>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, testId }) => (
    <div data-testid={testId} className="glass rounded-3xl p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-sphen-purple/20 flex items-center justify-center shrink-0">
            <Icon size={19} className="text-sphen-purple" />
        </div>
        <div>
            <p className="font-display text-3xl font-extrabold text-white leading-none">{value}</p>
            <p className="text-xs text-white/45 mt-1.5 uppercase tracking-widest">{label}</p>
        </div>
    </div>
);

const AdminDashboard = ({ onLogout }) => {
    const [stats, setStats] = useState(null);
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [s, l] = await Promise.all([getAdminStats(), getAdminLeads({ search, status })]);
            setStats(s.data);
            setLeads(l.data);
        } catch (err) {
            if (err.response?.status === 401) onLogout();
            else toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    }, [search, status, onLogout]);

    useEffect(() => {
        const t = setTimeout(load, 300);
        return () => clearTimeout(t);
    }, [load]);

    const changeStatus = async (id, newStatus) => {
        try {
            await updateLeadStatus(id, newStatus);
            setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
            toast.success(`Status → ${newStatus}`);
        } catch {
            toast.error("Could not update status");
        }
    };

    const removeLead = async (id) => {
        if (!window.confirm("Delete this lead permanently?")) return;
        try {
            await deleteLeadApi(id);
            setLeads((ls) => ls.filter((l) => l.id !== id));
            toast.success("Lead deleted");
        } catch {
            toast.error("Could not delete lead");
        }
    };

    const exportCsv = async () => {
        try {
            const { data } = await exportLeadsCsv();
            const url = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
            const a = document.createElement("a");
            a.href = url;
            a.download = "sphen_leads.csv";
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            toast.error("Export failed");
        }
    };

    const maxDaily = Math.max(1, ...(stats?.daily.map((d) => d.count) || [1]));

    return (
        <div data-testid="admin-dashboard" className="min-h-screen bg-[#050505] text-white">
            <header className="sticky top-0 z-50 bg-[#050505]/85 backdrop-blur-2xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/assets/s-logo.png" alt="SPHEN" className="w-9 h-auto" />
                        <div className="leading-none">
                            <p className="font-display font-extrabold text-white">Lead Manager</p>
                            <p className="text-[10px] tracking-[0.3em] text-sphen-orange font-semibold">SPHEN DIGITAL</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button data-testid="admin-refresh-button" onClick={load} className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white" aria-label="Refresh">
                            <RefreshCw size={16} />
                        </button>
                        <button data-testid="admin-export-button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full glass px-4 py-2.5 text-xs font-bold text-white hover:border-sphen-purple/60 transition-colors">
                            <Download size={14} /> <span className="hidden sm:inline">Export CSV</span>
                        </button>
                        <button data-testid="admin-logout-button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 border border-rose-400/30 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/25 transition-colors">
                            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Inbox} label="Today's Leads" value={stats?.today ?? "—"} testId="stat-today" />
                    <StatCard icon={Calendar} label="This Week" value={stats?.week ?? "—"} testId="stat-week" />
                    <StatCard icon={TrendingUp} label="This Month" value={stats?.month ?? "—"} testId="stat-month" />
                    <StatCard icon={Users} label="Total Leads" value={stats?.total ?? "—"} testId="stat-total" />
                </div>
                <div className="glass rounded-3xl p-6">
                    <p className="font-display font-bold text-white mb-5">Leads — Last 14 Days</p>
                    <div data-testid="leads-chart" className="flex items-end gap-1.5 h-32">
                        {(stats?.daily || []).map((d) => (
                            <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                                <span className="text-[10px] text-white/50">{d.count || ""}</span>
                                <div
                                    className="w-full rounded-t-md bg-gradient-to-t from-sphen-purple to-sphen-orange transition-all duration-500"
                                    style={{ height: `${Math.max(3, (d.count / maxDaily) * 88)}px` }}
                                />
                                <span className="text-[9px] text-white/35 truncate w-full text-center">{d.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                        <input
                            data-testid="admin-search-input"
                            placeholder="Search name, email, phone, company…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={inputCls + " w-full pl-10"}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap" data-testid="admin-status-filters">
                        {["", ...STATUSES].map((s) => (
                            <button
                                key={s || "all"}
                                data-testid={`filter-${(s || "all").toLowerCase().replace(/[^a-z]+/g, "-")}`}
                                onClick={() => setStatus(s)}
                                className={`rounded-full px-3.5 py-2 text-xs font-bold border transition-colors ${status === s ? "bg-sphen-purple text-white border-sphen-purple" : "glass text-white/60 hover:text-white"}`}
                            >
                                {s || "All"} {s && stats ? `(${stats.by_status[s] || 0})` : ""}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="glass rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[860px]">
                            <thead>
                                <tr className="text-left text-white/40 text-xs uppercase tracking-widest border-b border-white/10">
                                    <th className="px-5 py-4">Date</th>
                                    <th className="px-5 py-4">Name</th>
                                    <th className="px-5 py-4">Contact</th>
                                    <th className="px-5 py-4">Service</th>
                                    <th className="px-5 py-4">Source</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr><td colSpan={7} className="px-5 py-10 text-center text-white/40"><Loader2 size={18} className="animate-spin inline-block" /></td></tr>
                                )}
                                {!loading && leads.length === 0 && (
                                    <tr><td colSpan={7} className="px-5 py-10 text-center text-white/40">No leads found.</td></tr>
                                )}
                                {!loading && leads.map((l) => (
                                    <tr key={l.id} data-testid={`lead-row-${l.id.slice(0, 8)}`} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                        <td className="px-5 py-4 text-white/50 text-xs whitespace-nowrap">{(l.created_at || "").slice(0, 10)}</td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-white">{l.name}</p>
                                            {l.company && <p className="text-xs text-white/40">{l.company}</p>}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-white/70 text-xs">{l.email}</p>
                                            {l.phone && <p className="text-xs text-white/40">{l.phone}</p>}
                                        </td>
                                        <td className="px-5 py-4 text-white/70 text-xs">{l.service || "—"}</td>
                                        <td className="px-5 py-4"><span className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-bold text-white/60">{l.source_page}</span></td>
                                        <td className="px-5 py-4">
                                            <select
                                                data-testid={`lead-status-${l.id.slice(0, 8)}`}
                                                value={l.status}
                                                onChange={(e) => changeStatus(l.id, e.target.value)}
                                                className={`rounded-full px-2.5 py-1.5 text-[11px] font-bold border outline-none bg-transparent [&>option]:bg-[#121214] ${STATUS_COLORS[l.status] || ""}`}
                                            >
                                                {STATUSES.map((s) => <option key={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button data-testid={`lead-delete-${l.id.slice(0, 8)}`} onClick={() => removeLead(l.id)} aria-label="Delete lead" className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-300 hover:bg-rose-500/25 transition-colors">
                                                <Trash2 size={13} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default function AdminPage() {
    const [authed, setAuthed] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("sphen_admin_token");
        if (!token) return setAuthed(false);
        adminMe()
            .then(({ data }) => setAuthed(data.email))
            .catch(() => {
                localStorage.removeItem("sphen_admin_token");
                setAuthed(false);
            });
    }, []);

    const logout = () => {
        localStorage.removeItem("sphen_admin_token");
        setAuthed(false);
    };

    if (authed === null) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 size={28} className="animate-spin text-sphen-purple" />
            </div>
        );
    }
    return authed ? <AdminDashboard onLogout={logout} /> : <AdminLogin onLogin={setAuthed} />;
}
