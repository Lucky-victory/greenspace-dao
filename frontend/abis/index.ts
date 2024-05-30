export const communityAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_treasury",
        type: "address",
      },
      {
        internalType: "contract LinkTokenInterface",
        name: "_link",
        type: "address",
      },
      {
        internalType: "address",
        name: "_registrar",
        type: "address",
      },
      {
        internalType: "contract AutomationRegistryInterface",
        name: "_registry",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyAMember",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyANutrionist",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientPayment",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidApplicant",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDeadline",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSubStatus",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "UnauthorizedApplication",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
    ],
    name: "UnauthorizedMember",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
    ],
    name: "UnauthorizedNutritionist",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "applicant",
        type: "address",
      },
    ],
    name: "ApplicationApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "member",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "BurnNutritionistNFT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "member",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "BurnUserNFT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "nutritionist",
        type: "address",
      },
    ],
    name: "MintNutritionistNFT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "member",
        type: "address",
      },
    ],
    name: "MintUserNFT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "applicant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "dataURI",
        type: "string",
      },
    ],
    name: "NewApplication",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "dataURI",
        type: "string",
      },
    ],
    name: "NewSignUp",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allArticles",
    outputs: [
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "address",
        name: "author",
        type: "address",
      },
      {
        internalType: "string",
        name: "authorName",
        type: "string",
      },
      {
        internalType: "string",
        name: "content",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allCommunities",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "communityDescription",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allFitnessPlans",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "fitnessDescription",
        type: "string",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allMealPlans",
    outputs: [
      {
        internalType: "string",
        name: "mealName",
        type: "string",
      },
      {
        internalType: "string",
        name: "mealDescription",
        type: "string",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allNutritionists",
    outputs: [
      {
        internalType: "string",
        name: "nutritionistPersonalData",
        type: "string",
      },
      {
        internalType: "address",
        name: "nutritionistAddress",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "consultant",
            type: "address",
          },
          {
            internalType: "string",
            name: "consultationDescription",
            type: "string",
          },
        ],
        internalType: "struct CommunityNetwork.ConsultationServices",
        name: "consultationServices",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allNutritionistsAddresses",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allNutritionistsApplicants",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allNutritionistsApplications",
    outputs: [
      {
        internalType: "string",
        name: "dataURI",
        type: "string",
      },
      {
        internalType: "address",
        name: "nutritionistAddress",
        type: "address",
      },
      {
        internalType: "enum CommunityNetwork.NutritionistApplicationStatus",
        name: "applicationStatus",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allUserAddresses",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allUsers",
    outputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "userPersonalData",
        type: "string",
      },
      {
        internalType: "enum CommunityNetwork.UserSubscriptionStatus",
        name: "subStatus",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "subDeadline",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "applicantToIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "dataURI",
        type: "string",
      },
    ],
    name: "applyForNutritionistRole",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "applicant",
        type: "address",
      },
      {
        internalType: "string",
        name: "nutritionistNftUri",
        type: "string",
      },
    ],
    name: "approveNutritionistRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelNutritionistApplication",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "checkApplicationStatus",
    outputs: [
      {
        internalType: "enum CommunityNetwork.NutritionistApplicationStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "checkIsMember",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "checkIsNutritionist",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "checkUpkeep",
    outputs: [
      {
        internalType: "bool",
        name: "upkeepNeeded",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "performData",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "communityDesc",
        type: "string",
      },
      {
        internalType: "address[]",
        name: "_members",
        type: "address[]",
      },
    ],
    name: "createCommunity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_consultationDesc",
        type: "string",
      },
    ],
    name: "createConsultation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_fitnessName",
        type: "string",
      },
      {
        internalType: "string",
        name: "fitnessDesc",
        type: "string",
      },
    ],
    name: "createFitnessPlan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_mealName",
        type: "string",
      },
      {
        internalType: "string",
        name: "mealPlanDesc",
        type: "string",
      },
    ],
    name: "createMealPlan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllArticles",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "address",
            name: "author",
            type: "address",
          },
          {
            internalType: "string",
            name: "authorName",
            type: "string",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
        ],
        internalType: "struct CommunityNetwork.Articles[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllCommunties",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "communityDescription",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "members",
            type: "address[]",
          },
        ],
        internalType: "struct CommunityNetwork.Community[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllFitnessPlans",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "fitnessDescription",
            type: "string",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
        ],
        internalType: "struct CommunityNetwork.FitnessPlans[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllMealPlans",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "mealName",
            type: "string",
          },
          {
            internalType: "string",
            name: "mealDescription",
            type: "string",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
        ],
        internalType: "struct CommunityNetwork.MealPlans[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllMembers",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "userAddress",
            type: "address",
          },
          {
            internalType: "string",
            name: "userPersonalData",
            type: "string",
          },
          {
            internalType: "enum CommunityNetwork.UserSubscriptionStatus",
            name: "subStatus",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "subDeadline",
            type: "uint256",
          },
        ],
        internalType: "struct CommunityNetwork.User[]",
        name: "_users",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllNutritionists",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "nutritionistPersonalData",
            type: "string",
          },
          {
            components: [
              {
                internalType: "string",
                name: "mealName",
                type: "string",
              },
              {
                internalType: "string",
                name: "mealDescription",
                type: "string",
              },
              {
                internalType: "address",
                name: "creator",
                type: "address",
              },
            ],
            internalType: "struct CommunityNetwork.MealPlans[]",
            name: "nutritionistMealplans",
            type: "tuple[]",
          },
          {
            internalType: "address",
            name: "nutritionistAddress",
            type: "address",
          },
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "fitnessDescription",
                type: "string",
              },
              {
                internalType: "address",
                name: "creator",
                type: "address",
              },
            ],
            internalType: "struct CommunityNetwork.FitnessPlans[]",
            name: "fitnessPlans",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "address",
                name: "consultant",
                type: "address",
              },
              {
                internalType: "string",
                name: "consultationDescription",
                type: "string",
              },
            ],
            internalType: "struct CommunityNetwork.ConsultationServices",
            name: "consultationServices",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string",
                name: "title",
                type: "string",
              },
              {
                internalType: "address",
                name: "author",
                type: "address",
              },
              {
                internalType: "string",
                name: "authorName",
                type: "string",
              },
              {
                internalType: "string",
                name: "content",
                type: "string",
              },
            ],
            internalType: "struct CommunityNetwork.Articles[]",
            name: "nutritionistArticles",
            type: "tuple[]",
          },
        ],
        internalType: "struct CommunityNetwork.Nutritionist[]",
        name: "_nutritionists",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "i_link",
    outputs: [
      {
        internalType: "contract LinkTokenInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "i_registry",
    outputs: [
      {
        internalType: "contract AutomationRegistryInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "idToCommunity",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "communityDescription",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_communityId",
        type: "uint256",
      },
    ],
    name: "joinCommunity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nutritionistApplicationFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nutritionistApplicationStatus",
    outputs: [
      {
        internalType: "enum CommunityNetwork.NutritionistApplicationStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nutritionistApplications",
    outputs: [
      {
        internalType: "string",
        name: "dataURI",
        type: "string",
      },
      {
        internalType: "address",
        name: "nutritionistAddress",
        type: "address",
      },
      {
        internalType: "enum CommunityNetwork.NutritionistApplicationStatus",
        name: "applicationStatus",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nutritionistNFT",
    outputs: [
      {
        internalType: "contract INutritionistNFT",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nutritionists",
    outputs: [
      {
        internalType: "string",
        name: "nutritionistPersonalData",
        type: "string",
      },
      {
        internalType: "address",
        name: "nutritionistAddress",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "consultant",
            type: "address",
          },
          {
            internalType: "string",
            name: "consultationDescription",
            type: "string",
          },
        ],
        internalType: "struct CommunityNetwork.ConsultationServices",
        name: "consultationServices",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "performData",
        type: "bytes",
      },
    ],
    name: "performUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_authorName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_content",
        type: "string",
      },
    ],
    name: "publishArticle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "encryptedEmail",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "upkeepContract",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "gasLimit",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "adminAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "checkData",
        type: "bytes",
      },
      {
        internalType: "uint96",
        name: "amount",
        type: "uint96",
      },
      {
        internalType: "uint8",
        name: "source",
        type: "uint8",
      },
    ],
    name: "registerAndPredictID",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_userData",
        type: "string",
      },
      {
        internalType: "string",
        name: "nftUri",
        type: "string",
      },
    ],
    name: "registerUser",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "registrar",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "applicant",
        type: "address",
      },
    ],
    name: "rejectNutritionistRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "nftUri",
        type: "string",
      },
    ],
    name: "renewSubscription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_member",
        type: "address",
      },
    ],
    name: "revokeUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_userNFT",
        type: "address",
      },
      {
        internalType: "address",
        name: "_nutritionistNFT",
        type: "address",
      },
    ],
    name: "setNFTs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "subscriptionDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "userApplicationFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "userNFT",
    outputs: [
      {
        internalType: "contract IUserNFT",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userToCommunity",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "communityDescription",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userToIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];