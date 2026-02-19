const API_URL = "/api/auth";

const handleResponse = async (res) => {
    const text = await res.text();
    console.log("RAW RESPONSE:", text);
    let data;
    try {
        data = JSON.parse(text);
    } catch (err) {
        console.error("Response is not JSON:", text);
        throw new Error("Invalid server response: " + text.substring(0, 50));
    }

    if (!res.ok) {
        throw new Error(data.msg || "Request failed");
    }
    return data;
};

export const signup = async (phone, name) => {
    const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name }),
    });

    const data = await handleResponse(res);
    localStorage.setItem("token", data.token);
    return data;
};

export const login = async (phone) => {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
    });

    const data = await handleResponse(res);
    localStorage.setItem("token", data.token);
    return data;
};

export const fetchCurrentUser = async () => {
    const token = getToken();
    if (!token) return null;

    const res = await fetch(`${API_URL}/me`, {
        method: "GET",
        headers: {
            "x-auth-token": token
        }
    });

    if (!res.ok) {
        logout();
        return null;
    }

    return await res.json();
};

export const getToken = () => localStorage.getItem("token");

export const logout = () => localStorage.removeItem("token");

export const isLoggedIn = () => !!getToken();
