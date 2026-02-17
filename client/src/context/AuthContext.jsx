import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, fetchCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const userData = await fetchCurrentUser();
            if (userData) {
                setUser(userData);
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (phone) => {
        const data = await apiLogin(phone);
        setUser(data.user);
        return data;
    };

    const signup = async (phone, name) => {
        const data = await apiSignup(phone, name);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
