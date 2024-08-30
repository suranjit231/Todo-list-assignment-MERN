import { createContext, useState, useContext } from "react";
import { useEffect } from "react";
// Create the context
const UserTaskContext = createContext();

// Custom hook for accessing the context
export const useUserTask = () => {
    return useContext(UserTaskContext);
};

// Provider component
export function UserTaskProvider({ children }) {
    const [isShowSidebar, setIsShowSideBar] = useState(false);
    const [ isSearchBar, setIsSearchBar] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 720);

      // Handle responsiveness for search bar
      const handleResize = () => {
        setIsMobile(window.innerWidth < 720);
        if (window.innerWidth >= 720) {
            // setShowSearch(false);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    //===== function toggle sidebar ====//
    function toggleShowSidebar(){
        setIsShowSideBar((prev)=>!prev);
        if(isSearchBar){
            setIsSearchBar(false);
        }
    }

    //==== toggle search div for responsiveness===//
    function toggleSearchBar(){
        setIsSearchBar((prev)=>!prev);
        if(isShowSidebar){
            setIsShowSideBar(false);
        }
    }

    return (
        <UserTaskContext.Provider value={{ isShowSidebar, toggleShowSidebar,
                         isSearchBar, toggleSearchBar, isMobile }}>
            {children}
        </UserTaskContext.Provider>
    );
}
