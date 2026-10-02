import React, { createContext } from "react";
export const dataContext = createContext();
const UserContext = ({ children }) => {
  const serverURL = "http://localhost:8000";
  const value = {
    serverURL,
  };
  return <dataContext.Provider value={value}>{children}</dataContext.Provider>;
};

export default UserContext;
