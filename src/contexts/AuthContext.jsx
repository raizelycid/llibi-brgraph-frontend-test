import { createContext, useContext, useState } from "react";
import axios from '../api/sanctum';
import  secureLocalStorage  from  "react-secure-storage";

const AuthContent = createContext({
    user: null,
    setUser: () => {},
    csrfToken: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, _setUser] = useState(
        secureLocalStorage.getItem("auth_token")
    );

    const setUser = (user) => {
        if (user) {
            secureLocalStorage.setItem("auth_token",user);
        } else {
            secureLocalStorage.removeItem("auth_token");
        }
        _setUser(user);
    };

    const csrfToken = async () => {
        await axios.get('/csrf-cookie');
        return true;
    }

    return (
        <AuthContent.Provider value={{ user, setUser, csrfToken }}>
            {children}
        </AuthContent.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContent);
}