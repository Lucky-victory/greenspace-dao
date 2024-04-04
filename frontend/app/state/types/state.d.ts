export interface IAddressToken {
  Link: string;
  Usdt: string;
  Dai: string;
  address: string;
}

export interface IAddressData {
  address: string;
}


export type stateContextType = {
  address: string;
  allTokensData: any;
  loading: boolean;
  isUserConnected: boolean;
  setAllTokenData: (data: any) => void;
  setAddress: (data: string) => void;
  setLoading: (data: boolean) => void;
  setIsUserConnected: (data: boolean) => void;
  user: User;
  setUser: (data: any) => void;
  setSelectedMealPlan:(data:MealPlan)=>void
  selectedMealPlan:MealPlan|null;
  
  communities: Community[] | null;
  setCommunities: (data: Community[]) => void
  community: Community | null;
  setCommunity: (data: Community | null) => void
  mealPlans: MealPlan[] | null;
  setMealPlans: (data: MealPlans[]) => void
  ensName: any;
  setEnsName: (data: any) => void;
  ensAvatar: any;
  setEnsAvatar: (data: any) => void;
};
export type User = {
  userAddress: string,
  name: string,
  userCidData?: string,
  startDate?: string,
  endDate?: string,
  amount?: string,
}
export type Community = {
  name: string;
  description: string;
  cover: string;
  membersCount: number;
  id: string;
  slug: string;
  members: object[];
  messages?: ChatMessages[] | null
};
export type ChatMessages = {
  id: string;
  content: string;
  userAddress: string;
  fullname: string;
  timestamp: Date | number;
};


