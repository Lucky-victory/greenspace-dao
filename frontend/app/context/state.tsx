"use client";
//eslint#disabling-rules
import { createContext, useContext, useState } from "react";
import { Community, User, stateContextType } from "../types/state";
import { useAccount, useNetwork, useWalletClient, useEnsName } from "wagmi";
import { MealPlan } from "@/types/shared";
const defaultCommunities = [
  {
    name: "All for good",
    id: "1",
    slug: "GS_238491048",
    membersCount: 20,
    members: [{}],
    cover: "",
    description:
      'Join a movement that goes beyond personal well-being. In the "All for Good" nutrition community, we believe in the power of nutrition to create positive change. Share your journey towards a healthier you, engage in impactful discussions about sustainable eating, and explore how good nutrition can contribute to a better world. Every meal counts, and together, we\'re making choices that are "All for Good."',
  },
  {
    name: "Live life to fullness",
    id: "2",
    slug: "live-life-to-fullness-fed3",
    membersCount: 10,
    members: [{}],
    cover: "",
    description:
      'Experience a community that encourages you to savor every bite and live life to the fullest through mindful nutrition. In "Live Life to Fullness," we embrace a holistic approach to well-being, celebrating the pleasures of nourishing both body and soul. Discover a wealth of resources, connect with fellow members on a journey to vitality, and learn how to make every aspect of your life more fulfilling through balanced and joyful nutrition.',
  },
  {
    name: "Meet your faves",
    id: "3",
    slug: "meet-your-faves-acd2",
    membersCount: 45,
    members: [{}],
    cover: "",
    description:
      'Discover a vibrant community where nutrition enthusiasts unite to share their favorite recipes, wellness tips, and success stories. Connect with like-minded individuals, learn from nutrition experts, and celebrate the joy of nourishing your body. In "Meet Your Faves," we believe that building a supportive network is key to embracing a healthier lifestyle together.',
  },
];

const contextDefaultValue: stateContextType = {
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
  communities: defaultCommunities,
  community: null,
  setCommunities: () => null,
  setCommunity: () => null,
  mealPlans: [] as MealPlan[],

  setMealPlans: () => null,
  selectedMealPlan: {},
  setSelectedMealPlan: () => null,

  ensName: null,
  setEnsName: () => null,
  ensAvatar: null,
  setEnsAvatar: () => null,
};

type StateContextProviderProps = {
  children: React.ReactNode;
};

const AppContext = createContext<stateContextType>(contextDefaultValue);

export function AppWrapper({ children }: StateContextProviderProps) {
  const [allTokensData, setAllTokenData] = useState<any>({
    userNftUri:
      "https://bafybeicxroigojtsvluxivtdkgmhcjijhnlvco2prg57ws6k3hqetkvhzu.ipfs.dweb.link/user%20badge.png",
    nutritionistNftUri:
      "https://bafybeihbll3mj2l44kqy67gbxwnvui2zqfdphzr5mr53mxto77hgo4umka.ipfs.dweb.link/nutritionist%20badge.png",
  });
  const [address, setAddress] = useState<string>("");

  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(
    null
  );
  const [community, setCommunity] = useState<Community | null>(null);
  const [communities, setCommunities] =
    useState<Community[]>(defaultCommunities);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

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
  const [nutritionist, setNutritionist] = useState("");

  let sharedState = {
    mealPlans,
    setMealPlans,
    allTokensData,
    setAllTokenData,
    address,
    setAddress,
    loading,
    setLoading,
    isUserConnected,
    setIsUserConnected,
    user,
    selectedMealPlan,
    setSelectedMealPlan,
    setUser,
    communities,
    community,
    setCommunities,
    setCommunity,
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
