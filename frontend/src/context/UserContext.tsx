import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
    username: string | null;
    userZcode: string | null;
    roles: string[];
    setUsername: (name: string | null) => void;
    setUserZcode: (zcode: string | null) => void;
    setRoles: (roles: string[]) => void;
}

const UserContext = createContext<UserContextType>({
    username: null,
    userZcode: null,
    roles: [],
    setUsername: () => {},
    setUserZcode: () => {},
    setRoles: () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [userZcode, setUserZcode] = useState<string | null>(null);
    const [roles, setRoles] = useState<string[]>([]);

    useEffect(() => {
        const savedUsername = localStorage.getItem("username");
        const savedZcode = localStorage.getItem("userZcode");
        const savedRoles = localStorage.getItem("user_roles");

        console.log("Saved username:", savedUsername);
        console.log("Saved Zcode:", savedZcode);
        if (savedRoles) setRoles(JSON.parse(savedRoles));
        if (savedUsername) {
            setUsername(savedUsername);
        }
        if (savedZcode) {
            setUserZcode(savedZcode);
        } else {
            console.warn("Invalid user Zcode in localStorage:", savedZcode);
        }
    }, []);



    return (
        <UserContext.Provider value={{ username, userZcode,roles, setUsername, setUserZcode,setRoles }}>
            {children}
        </UserContext.Provider>
    );
};
