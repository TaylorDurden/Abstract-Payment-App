import React, { createContext, useContext, useReducer } from "react";

const AccountContext = createContext<any>(null);

const initialState = {
  fetchAccounts: false,
};

function accountReducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case "START_FETCH_ACCOUNTS":
      return { ...state, fetchAccounts: true };
    case "STOP_FETCH_ACCOUNTS":
      return { ...state, fetchAccounts: false };
    default:
      return state;
  }
}

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  return (
    <AccountContext.Provider value={{ state, dispatch }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccountContext must be used within an AccountProvider");
  }
  return context;
};
