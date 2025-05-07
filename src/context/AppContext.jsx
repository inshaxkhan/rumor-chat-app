import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [userData,setUserData]=useState(null);
    const [chatData,setChatData]=useState(null);

    const value = {
        userData,setUserData,
        chatData,setChatData
    }

    return (
        <AppContextProvider value={value}>
            {props.children}
        </AppContextProvider>
    )
}

export default AppContextProvider