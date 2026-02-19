const API_URL = "/api/auth";

const handleResponse = async (res) => {
    let data;
    try {
        data = await res.json();
    } catch (err) {
        console.error("Response is not JSON");
        throw new Error("Invalid server response");
    }

    if (!res.ok) {
        throw new Error(data.msg || "Request failed");
    }
    return data;
};

export const signup = async (email, password, name) => {
    try {
        const res = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
        });

        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            throw new Error(`Non-JSON response: ${text.substring(0, 50)}...`);
        }

        if (!res.ok) {
            throw new Error(data.error || data.detail || data.msg || "Signup failed");
        }

        // Handle token storage if signup logs user in directly
        if (data.token) {
            localStorage.setItem("token", data.token);
        }

        return data;
    } catch (err) {
        console.error("SIGNUP ERROR:", err);
        throw err;
    }
};

export const login = async (email, password) => {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            throw new Error(`Non-JSON response: ${text.substring(0, 50)}...`);
        }

        if (!res.ok) {
            throw new Error(data.error || data.detail || data.msg || "Login failed");
        }

        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        return data;
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        throw err;
    }
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
