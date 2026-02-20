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
export async function setPrediction(gameKey, number) {
    console.warn("setPrediction is not implemented on the current backend.");
    return { success: false, message: "Endpoint not available" };
}

export async function unsetPrediction(gameKey) {
    console.warn("unsetPrediction is not implemented on the current backend.");
    return { success: false, message: "Endpoint not available" };
}

export async function fetchLiveBets(gameKey) {
    console.warn("fetchLiveBets is not implemented on the current backend.");
    return { success: true, data: { bets: [], total: 0 } };
}
