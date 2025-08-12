import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
    username: string | null;
    userZcode: string | null;
    setUsername: (name: string | null) => void;
    setUserZcode: (zcode: string | null) => void;
}

const UserContext = createContext<UserContextType>({
    username: null,
    userZcode: null,
    setUsername: () => {},
    setUserZcode: () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [userZcode, setUserZcode] = useState<string | null>(null);

    useEffect(() => {
        const savedUsername = localStorage.getItem("username");
        const savedZcode = localStorage.getItem("userZcode");

        console.log("Saved username:", savedUsername);
        console.log("Saved Zcode:", savedZcode);

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
        <UserContext.Provider value={{ username, userZcode, setUsername, setUserZcode }}>
            {children}
        </UserContext.Provider>
    );
};
