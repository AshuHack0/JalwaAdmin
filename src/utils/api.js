const API_BASE_URL = "http://localhost:3000/api/v1";

const GAME_API_MAP = {
    "30sec": "WinGo_30S",
    "1min": "WinGo_1Min",
    "3min": "WinGo_3Min",
    "5min": "WinGo_5Min",
};

function getToken() {
    const userData = localStorage.getItem("jalwa_admin_user");
    if (!userData) return null;
    try {
        return JSON.parse(userData).token || null;
    } catch {
        return null;
    }
}

export async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (res.status === 401 || res.status === 403) {
        window.dispatchEvent(new CustomEvent('jalwa:logout'));
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || `API error ${res.status}`);
    }

    return data;
}

// ── Auth ──

export async function adminLogin(phone, password) {
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone, password }),
    });
}

// ── WinGo ──

export async function fetchCurrentRound(gameKey) {
    const apiPath = GAME_API_MAP[gameKey];
    return apiFetch(`/WinGo/${apiPath}`);
}

export async function fetchGameHistory(gameKey, page = 1) {
    const apiPath = GAME_API_MAP[gameKey];
    return apiFetch(`/WinGo/${apiPath}/history?page=${page}&pageSize=10`);
}
export async function fetchCurrentPrediction(gameKey) {
    const apiPath = GAME_API_MAP[gameKey];
    return apiFetch(`/WinGo/${apiPath}/prediction`);
}


export async function setPrediction(gameKey, number) {
    const apiPath = GAME_API_MAP[gameKey];
    return apiFetch(`/WinGo/${apiPath}/prediction`, {
        method: "PATCH",
        body: JSON.stringify({ number }),
    });
}

export async function unsetPrediction(gameKey) {
    const apiPath = GAME_API_MAP[gameKey];
    return apiFetch(`/WinGo/${apiPath}/prediction`, { method: "DELETE" });
}

export async function fetchLiveBets(_gameKey) {
    console.warn("fetchLiveBets is not implemented on the current backend.");
    return { success: true, data: { bets: [], total: 0 } };
}

export async function changeAdminPassword(newPassword) {
    return apiFetch("/auth/password", {
        method: "PATCH",
        body: JSON.stringify({ newPassword }),
    });
}

// ── Users (Admin) ──

export async function fetchUsers({ phone = "", uid = "", page = 1, limit = 50, isBanned } = {}) {
    const params = new URLSearchParams({ page, limit });
    if (phone) params.set("phone", phone);
    if (uid) params.set("uid", uid);
    if (isBanned !== undefined) params.set("isBanned", isBanned);
    return apiFetch(`/users?${params}`);
}

export async function toggleBanUser(id) {
    return apiFetch(`/users/${id}/ban`, { method: "PATCH" });
}

export async function deleteUser(id) {
    return apiFetch(`/users/${id}`, { method: "DELETE" });
}

export async function fetchUsersWithBankDetails(phone = "") {
    const params = new URLSearchParams();
    if (phone) params.set("phone", phone);
    return apiFetch(`/users/bank-details?${params}`);
}

export async function getUserByPhone(phone) {
    return apiFetch(`/users/by-phone?phone=${encodeURIComponent(phone)}`);
}

export async function updateBankDetails(id, details) {
    return apiFetch(`/users/${id}/bank`, {
        method: "PATCH",
        body: JSON.stringify(details),
    });
}

// ── Deposits (Admin) ──

export async function fetchDeposits({ status = "pending", page = 1, search = "" } = {}) {
    return apiFetch(`/admin/deposits?status=${status}&page=${page}&search=${encodeURIComponent(search)}`);
}

export async function approveDeposit(id) {
    return apiFetch(`/admin/deposits/${id}/approve`, { method: "PATCH" });
}

export async function rejectDeposit(id) {
    return apiFetch(`/admin/deposits/${id}/reject`, { method: "PATCH" });
}

// ── Withdrawals (Admin) ──

export async function fetchWithdrawals({ status = "pending", page = 1, search = "" } = {}) {
    return apiFetch(`/withdrawals?status=${status}&page=${page}&search=${encodeURIComponent(search)}`);
}

export async function approveWithdrawal(id, paymentRef = "") {
    return apiFetch(`/withdrawals/${id}/approve`, {
        method: "PATCH",
        body: JSON.stringify({ paymentRef }),
    });
}

export async function rejectWithdrawal(id, remark = "") {
    return apiFetch(`/withdrawals/${id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ remark }),
    });
}

// ── Bonus ──

export async function assignBonus({ phone, bonusType, amount, remark }) {
    return apiFetch("/bonus/assign", {
        method: "POST",
        body: JSON.stringify({ phone, bonusType, amount, remark }),
    });
}

export async function fetchBonuses(page = 1) {
    return apiFetch(`/bonus?page=${page}&limit=50`);
}

// ── Gift Codes ──

export async function generateGiftCodes({ count, maxUses, amount, remark }) {
    return apiFetch("/gift-codes/generate", {
        method: "POST",
        body: JSON.stringify({ count, maxUses, amount, remark }),
    });
}

export async function fetchGiftCodes() {
    return apiFetch("/gift-codes");
}

export async function deleteGiftCode(id) {
    return apiFetch(`/gift-codes/${id}`, { method: "DELETE" });
}

// ── Telegram ──

export async function fetchTelegram() {
    return apiFetch("/telegram");
}

export async function upsertTelegram(url) {
    return apiFetch("/telegram", {
        method: "PUT",
        body: JSON.stringify({ url }),
    });
}

export async function removeTelegram() {
    return apiFetch("/telegram", { method: "DELETE" });
}
