import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
    username: string | null;
    setUsername: (name: string | null) => void;
}

const UserContext = createContext<UserContextType>({
    username: null,
    setUsername: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [username, setUsername] = useState<string | null>(null);

    // 🔁 页面刷新后从 localStorage 恢复 username
    useEffect(() => {
        const savedUsername = localStorage.getItem("username");
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

    return (
        <UserContext.Provider value={{ username, setUsername }}>
            {children}
        </UserContext.Provider>
    );
};
