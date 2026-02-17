const API_URL = "http://localhost:5001/api/auth";

export const signup = async (phone, name) => {
    const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.msg || "Signup failed");
    }

    localStorage.setItem("token", data.token);
    return data;
};

export const login = async (phone) => {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.msg || "Login failed");
    }

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
