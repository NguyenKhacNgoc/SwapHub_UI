
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useContext, useState } from "react";

// AuthContext.js
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = () => {
        setIsLoggedIn(true)
    }

    const logout = async() => {
        await AsyncStorage.removeItem('accessToken')
        setIsLoggedIn(false);
    }
    const checkAuth = async () => {
        try {
          const accessToken = await AsyncStorage.getItem('accessToken')
          const response = await axios.get('http://khacngoc.ddns.net:8080/api/checkauth', {
            headers: {
              Authorization: `Bearer ${accessToken}`
    
            }
          })
          if (response.status === 200) login()
        }
        catch (error) {
          logout()
        }
      }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
