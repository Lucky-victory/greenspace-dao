import { createContext, useContext, useState } from "react";
import { User, stateContextType } from "src/types/state";

const contextDefaultValue: Partial<stateContextType> = {
  allTokensData: {},
  address: "",
  setAllTokenData: () => null,
  setAddress: () => null,
  loading: false,
  setLoading: () => null,
  isUserConnected: false,
  setIsUserConnected: () => null,
  user: {} as User,
  setUser: () => null,

  ensName: null,
  setEnsName: () => null,
  ensAvatar: null,
  setEnsAvatar: () => null,
};

type StateContextProviderProps = {
  children: React.ReactNode;
};

const AppContext =
  createContext<Partial<stateContextType>>(contextDefaultValue);

export function AppWrapper({ children }: StateContextProviderProps) {
  const [allTokensData, setAllTokenData] = useState<any>({
    userNftUri:
      "https://bafybeicxroigojtsvluxivtdkgmhcjijhnlvco2prg57ws6k3hqetkvhzu.ipfs.dweb.link/user%20badge.png",
    nutritionistNftUri:
      "https://bafybeihbll3mj2l44kqy67gbxwnvui2zqfdphzr5mr53mxto77hgo4umka.ipfs.dweb.link/nutritionist%20badge.png",
  });
  const [address, setAddress] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [isUserConnected, setIsUserConnected] = useState<boolean>(false);
  const [ensName, setEnsName] = useState<any>();
  const [ensAvatar, setEnsAvatar] = useState<any>();

  const [user, setUser] = useState<User>({
    userAddress: "",
    name: "",
    userCidData: "",
    startDate: "",
    endDate: "",
    amount: "",
  });

  let sharedState = {
    allTokensData,
    setAllTokenData,
    address,
    setAddress,
    loading,
    setLoading,
    isUserConnected,
    setIsUserConnected,
    user,

    setUser,

    ensName,
    setEnsName,
    ensAvatar,
    setEnsAvatar,
  };

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
