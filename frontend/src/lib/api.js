import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const submitLead = (data) => axios.post(`${API}/leads`, data);
export const subscribeNewsletter = (email) => axios.post(`${API}/newsletter`, { email });
export const createStripeCheckout = (package_id) =>
    axios.post(`${API}/payments/stripe/checkout`, { package_id, origin_url: window.location.origin });
export const getPaymentStatus = (sessionId) => axios.get(`${API}/payments/status/${sessionId}`);
export const getPaymentConfig = () => axios.get(`${API}/payments/config`);
export const createRazorpayOrder = (package_id) => axios.post(`${API}/razorpay/create-order`, { package_id });
export const verifyRazorpayPayment = (data) => axios.post(`${API}/razorpay/verify`, data);

const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("sphen_admin_token") || ""}` } });

export const adminLogin = (email, password) => axios.post(`${API}/admin/login`, { email, password });
export const adminMe = () => axios.get(`${API}/admin/me`, authHeader());
export const getAdminLeads = (params) => axios.get(`${API}/admin/leads`, { ...authHeader(), params });
export const getAdminStats = () => axios.get(`${API}/admin/stats`, authHeader());
export const updateLeadStatus = (id, status) => axios.patch(`${API}/admin/leads/${id}`, { status }, authHeader());
export const deleteLeadApi = (id) => axios.delete(`${API}/admin/leads/${id}`, authHeader());
export const exportLeadsCsv = () => axios.get(`${API}/admin/leads-export`, { ...authHeader(), responseType: "blob" });
