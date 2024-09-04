import { objectToSearchParams } from "src/utils";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import {
  APIResponse,
  MEETING,
  MEETING_RECORD,
  NEW_MEETING,
  NEW_MEETING_RECORD,
  NEW_NUTRITIONIST,
  NEW_USER,
  Nutritionist,
  USER,
  VerificationStatus
} from "../types";
import {
  FitnessPlan,
  Article,
  MealPlan,
  NewArticle,
  NewFitnessPlan,
  NewMealPlan,
  Community,
  NEW_COMMUNITY
} from "src/types/shared";
import { update } from "../slices";

export const GreenSpaceDAOApi = createApi({
  reducerPath: "GreenSpaceDAOApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/"
  }),
  tagTypes: [
    "MeetingRecords",
    "Meetings",
    "Users",
    "Rooms",
    "Tokens",
    "Articles",
    "FitnessPlans",
    "MealPlans",
    "Communities",
    "CommunityEvents",
    "CommunityMembers",
    "CommunityMessages",
    "CommunityChallenges",
    "Appointments",
    "Nutritionists"
  ],

  endpoints: (builder) => ({
    addFitnessPlan: builder.mutation<APIResponse<FitnessPlan>, NewFitnessPlan>({
      query: (data) => ({
        url: `fitness-plans`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "FitnessPlans" as const, id: "LIST" }]
    }),
    addMealPlan: builder.mutation<APIResponse<MealPlan>, NewMealPlan>({
      query: ({ ...rest }) => ({
        url: `meal-plans`,
        method: "POST",
        body: { ...rest }
      }),
      invalidatesTags: [{ type: "MealPlans" as const, id: "LIST" }]
    }),
    sendUserInfoToAI: builder.mutation<APIResponse<any>, any>({
      query: (data) => ({
        url: `ai/`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Articles" as const, id: "LIST" }]
    }),
    getArticles: builder.query<
      Partial<APIResponse<Article[]>>,
      { status?: "all" | "published" | "draft"; authId?: string }
    >({
      query: (params) => {
        return {
          url: `articles?${objectToSearchParams(params)}`
        };
      },
      providesTags: (result) =>
        // is result available?
        result?.data
          ? // successful query
            [
              ...result?.data.map(({ slug }) => ({
                type: "Articles" as const,
                id: slug
              })),
              { type: "Articles", id: "LIST" }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Articles', id: 'LIST' }` is invalidated
            [{ type: "Articles", id: "LIST" }]
    }),
    getMealPlans: builder.query<
      Partial<APIResponse<MealPlan[]>>,
      { status?: "all" | "published" | "draft"; authId?: string }
    >({
      query: (params) => {
        return {
          url: `meal-plans?${objectToSearchParams(params)}`
        };
      },
      providesTags: (result) =>
        // is result available?
        result?.data
          ? // successful query
            [
              ...result?.data.map(({ slug }) => ({
                type: "MealPlans" as const,
                id: slug
              })),
              { type: "MealPlans", id: "LIST" }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'MealPlans', id: 'LIST' }` is invalidated
            [{ type: "MealPlans", id: "LIST" }]
    }),
    getFitnessPlans: builder.query<
      Partial<APIResponse<FitnessPlan[]>>,
      { status?: "all" | "published" | "draft"; authId?: string }
    >({
      query: (params) => {
        return {
          url: `fitness-plans?${objectToSearchParams(params)}`
        };
      },
      providesTags: (result) =>
        // is result available?
        result?.data
          ? // successful query
            [
              ...result?.data.map(({ slug }) => ({
                type: "FitnessPlans" as const,
                id: slug
              })),
              { type: "FitnessPlans", id: "LIST" }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'FitnessPlans', id: 'LIST' }` is invalidated
            [{ type: "FitnessPlans", id: "LIST" }]
    }),
    getArticle: builder.query<Partial<APIResponse<Article>>, { slug: string; use_id?: boolean }>({
      query: ({ slug, use_id = false }) => `articles/${slug}?use_id=${use_id}`,
      providesTags: (result, error, { slug }) => {
        return [{ type: "Articles" as const, id: slug }];
      }
    }),
    getMealPlan: builder.query<Partial<APIResponse<MealPlan>>, { slug: string; use_id?: boolean }>({
      query: ({ slug, use_id = false }) => `meal-plans/${slug}?use_id=${use_id}`,
      providesTags: (result, error, { slug }) => {
        return [{ type: "MealPlans" as const, id: slug }];
      }
    }),
    getFitnessPlan: builder.query<Partial<APIResponse<FitnessPlan>>, { slug: string; use_id?: boolean }>({
      query: ({ slug, use_id = false }) => `fitness-plans/${slug}?use_id=${use_id}`,
      providesTags: (result, error, { slug }) => {
        return [{ type: "FitnessPlans" as const, id: slug }];
      }
    }),
    updateArticle: builder.mutation<APIResponse<Article>, Partial<Article>>({
      query(data) {
        const { slug, ...body } = data;
        return {
          url: `articles/${slug}`,
          method: "PUT",
          body
        };
      },

      invalidatesTags: (result, error, { slug }) => [{ type: "Articles", id: slug }]
    }),
    updateUser: builder.mutation<
      APIResponse<Partial<USER>>,
      Partial<USER> & {
        addressOrAuthId: string;
      }
    >({
      query(data) {
        const { addressOrAuthId, ...body } = data;
        return {
          url: `users/${encodeURIComponent(addressOrAuthId)}`,
          method: "PUT",
          body
        };
      },

      invalidatesTags: (result, error, { addressOrAuthId }) => [{ type: "Articles", id: addressOrAuthId }]
    }),
    updateFitnessPlan: builder.mutation<APIResponse<FitnessPlan>, Partial<FitnessPlan>>({
      query(data) {
        const { slug, ...body } = data;
        return {
          url: `fitness-plans/${slug}`,
          method: "PUT",
          body
        };
      },

      invalidatesTags: (result, error, { slug }) => [{ type: "FitnessPlans", id: slug }]
    }),
    updateMealPlan: builder.mutation<APIResponse<MealPlan>, Partial<MealPlan>>({
      query(data) {
        const { slug, ...body } = data;
        return {
          url: `meal-plans/${slug}`,
          method: "PUT",
          body
        };
      },

      invalidatesTags: (result, error, { slug }) => [{ type: "MealPlans", id: slug }]
    }),

    getUser: builder.query<Partial<APIResponse<USER>>, { usernameOrAuthId: string; params?: Record<string, any> }>({
      query: ({ usernameOrAuthId, params }) => {
        return {
          url: `users/${encodeURIComponent(usernameOrAuthId)}?${objectToSearchParams(params!)}`
        };
      },
      providesTags: (result, error, { usernameOrAuthId }) => {
        return [{ type: "Users" as const, id: usernameOrAuthId }];
      }
    }),

    checkNutritionistStatus: builder.mutation<APIResponse<{ status: VerificationStatus }>, { address: string }>({
      query(data) {
        return {
          url: `users/nutritionists/status`,
          method: "POST",
          body: data
        };
      }
    }),
    getNutritionist: builder.query<
      Partial<APIResponse<Nutritionist>>,
      { usernameOrAuthId: string; params?: Record<string, any> }
    >({
      query: ({ usernameOrAuthId, params }) => {
        return {
          url: `users/nutritionists/${usernameOrAuthId}?${objectToSearchParams(params!)}`
        };
      },
      providesTags: (result, error, { usernameOrAuthId }) => {
        return [{ type: "Nutritionists" as const, id: usernameOrAuthId }];
      }
    }),
    getNutritionists: builder.query<Partial<APIResponse<Nutritionist[]>>, { status?: VerificationStatus | "all" }>({
      query: (params) => {
        return {
          url: `users/nutritionists?${objectToSearchParams(params)}`
        };
      },
      providesTags: (result) =>
        // is result available?
        result?.data
          ? // successful query
            [
              ...result?.data.map(({ authId }) => ({
                type: "Nutritionists" as const,
                id: authId
              })),
              { type: "Nutritionists", id: "LIST" }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'FitnessPlans', id: 'LIST' }` is invalidated
            [{ type: "Nutritionists", id: "LIST" }]
    }),
    getMeeting: builder.query<Partial<APIResponse<MEETING>>, Record<string, any> & { roomId: string }>({
      query: ({ roomId, ...params }) => {
        return {
          url: `meetings/${roomId}?${objectToSearchParams(params)}`
        };
      },
      providesTags: (result, error, { id }) => {
        return [{ type: "Meetings" as const, id }];
      }
    }),
    getMeetings: builder.query<Partial<APIResponse<MEETING[]>>, Record<string, string>>({
      query: (params) => {
        return {
          url: `meetings?${objectToSearchParams(params)}`
        };
      },
      providesTags: (result) =>
        // is result available?
        result?.data
          ? // successful query
            [
              ...result?.data.map(({ id }) => ({
                type: "Meetings" as const,
                id
              })),
              { type: "Meetings", id: "LIST" }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Meetings', id: 'LIST' }` is invalidated
            [{ type: "Meetings", id: "LIST" }]
    }),
    // TODO: Add return types
    getCommunities: builder.query<Partial<APIResponse<Community[]>>, { status?: string; userId?: string }>({
      query: (params) => {
        return {
          url: `communities?${objectToSearchParams(params)}`
        };
      },
      providesTags: (result) =>
        // is result available?
        result?.data
          ? // successful query
            [
              ...result?.data.map(({ id }) => ({
                type: "Communities" as const,
                id
              })),
              { type: "Communities", id: "LIST" }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Communities', id: 'LIST' }` is invalidated
            [{ type: "Communities", id: "LIST" }]
    }), // TODO: Add return types

    getCommunity: builder.query<APIResponse<Community>, { params?: Record<string, any>; spaceIdOrId: string }>({
      query: ({ spaceIdOrId, params }) => {
        return {
          url: `communities/${spaceIdOrId}?${objectToSearchParams(params!)}`
        };
      },
      providesTags: (result, error, { spaceIdOrId }) => {
        return [{ type: "Communities" as const, id: spaceIdOrId }];
      }
    }),
    getCommunityEvent: builder.query<Partial<APIResponse<any>>, { params?: Record<string, any>; slugId: string }>({
      query: ({ slugId, params }) => {
        return {
          url: `community/events/${slugId}?${objectToSearchParams(params!)}`
        };
      },
      providesTags: (result, error, { slugId }) => {
        return [{ type: "CommunityEvents" as const, id: slugId }];
      }
    }),
    getCommunityChallenge: builder.query<Partial<APIResponse<any>>, { params?: Record<string, any>; slugId: string }>({
      query: ({ slugId, params }) => {
        return {
          url: `community/challenges/${slugId}?${objectToSearchParams(params!)}`
        };
      },
      providesTags: (result, error, { slugId }) => {
        return [{ type: "CommunityChallenges" as const, id: slugId }];
      }
    }),
    // TODO: Add return types
    getCommunityEvents: builder.query<Partial<APIResponse<any[]>>, { spaceIdOrId: string } & Record<string, any>>({
      query: ({ spaceIdOrId, ...params }) => {
        return {
          url: `communities/${spaceIdOrId}/events?${objectToSearchParams(params)}`
        };
      },
      providesTags: (result) =>
        // is result available?
        result?.data
          ? // successful query
            [
              ...result?.data.map(({ id }) => ({
                type: "CommunityEvents" as const,
                id
              })),
              { type: "CommunityEvents", id: "LIST" }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'CommunityEvents', id: 'LIST' }` is invalidated
            [{ type: "CommunityEvents", id: "LIST" }]
    }),
    // TODO: Add return types
    getCommunityMessages: builder.query<Partial<APIResponse<any[]>>, { spaceIdOrId: string } & Record<string, any>>({
      query: ({ spaceIdOrId, ...params }) => {
        return {
          url: `communities/${spaceIdOrId}/messages?${objectToSearchParams(params)}`
        };
      },

      providesTags: (result) =>
        // is result available?
        result?.data
          ? // successful query
            [
              ...result?.data.map(({ id }) => ({
                type: "CommunityMessages" as const,
                id
              })),
              { type: "CommunityMessages", id: "LIST" }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'CommunityMessages', id: 'LIST' }` is invalidated
            [{ type: "CommunityMessages", id: "LIST" }]
    }),
    // TODO: Add return types
    getCommunityMembers: builder.query<Partial<APIResponse<any[]>>, { spaceIdOrId: string } & Record<string, any>>({
      query: ({ spaceIdOrId, ...params }) => {
        return {
          url: `communities/${spaceIdOrId}/members?${objectToSearchParams(params)}`
        };
      },
      providesTags: (result) =>
        // is result available?
        result?.data
          ? // successful query
            [
              ...result?.data.map(({ id }) => ({
                type: "CommunityMembers" as const,
                id
              })),
              { type: "CommunityMembers", id: "LIST" }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'CommunityMembers', id: 'LIST' }` is invalidated
            [{ type: "CommunityMembers", id: "LIST" }]
    }),
    // TODO: Add return types
    getCommunityChallenges: builder.query<Partial<APIResponse<any[]>>, { spaceIdOrId: string } & Record<string, any>>({
      query: ({ spaceIdOrId, ...params }) => {
        return {
          url: `communities/${spaceIdOrId}/challenges?${objectToSearchParams(params)}`
        };
      },
      providesTags: (result) =>
        // is result available?
        result?.data
          ? // successful query
            [
              ...result?.data.map(({ id }) => ({
                type: "CommunityChallenges" as const,
                id
              })),
              { type: "CommunityChallenges", id: "LIST" }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'CommunityChallenges', id: 'LIST' }` is invalidated
            [{ type: "CommunityChallenges", id: "LIST" }]
    }),
    // TODO: Add return types
    getAppointments: builder.query<Partial<APIResponse<any[]>>, { status?: string } & Record<string, any>>({
      query: (params) => {
        return {
          url: `appointments?${objectToSearchParams(params)}`
        };
      },
      providesTags: (result) =>
        // is result available?
        result?.data
          ? // successful query
            [
              ...result?.data.map(({ id }) => ({
                type: "Appointments" as const,
                id
              })),
              { type: "Appointments", id: "LIST" }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Appointments', id: 'LIST' }` is invalidated
            [{ type: "Appointments", id: "LIST" }]
    }),
    getUsers: builder.query<Partial<APIResponse<USER[]>>, void>({
      query: () => {
        return {
          url: `users`
        };
      },
      providesTags: (result) =>
        // is result available?
        result?.data
          ? // successful query
            [
              ...result?.data.map(({ id }) => ({
                type: "Users" as const,
                id: id
              })),
              { type: "Users", id: "LIST" }
            ]
          : [{ type: "Users", id: "LIST" }]
    }),
    // TODO: Add return types
    getAppointment: builder.query<Partial<APIResponse<any>>, { params: Record<string, any>; appointmentId: string }>({
      query: ({ appointmentId, params }) => {
        return {
          url: `appointments/${appointmentId}?${objectToSearchParams(params)}`
        };
      },
      providesTags: (result, error, { appointmentId }) => {
        return [{ type: "Appointments" as const, id: appointmentId }];
      }
    }),

    getMeetingRecords: builder.query<Partial<APIResponse<MEETING_RECORD[]>>, Record<string, string>>({
      query: (params) => {
        return {
          url: `meeting-records?${objectToSearchParams(params)}`
        };
      },
      providesTags: (result) =>
        // is result available?
        result?.data
          ? // successful query
            [
              ...result?.data.map(({ id }) => ({
                type: "MeetingRecords" as const,
                id
              })),
              { type: "MeetingRecords", id: "LIST" }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'MeetingRecords', id: 'LIST' }` is invalidated
            [{ type: "MeetingRecords", id: "LIST" }]
    }),
    createRoom: builder.mutation<
      APIResponse<{ roomId: string; token?: string }>,
      {
        title: string;
        hostWallets?: string[];
        roomLocked?: boolean;
        params?: Record<string, string>;
      }
    >({
      query: ({ params, ...data }) => ({
        url: `create-room/?${objectToSearchParams(params!)}`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Rooms" as const, id: "LIST" }]
    }),
    createToken: builder.mutation<
      APIResponse<{
        metadata: {
          displayName: string;
          address?: string;
          username?: string;
          authId: string;
        };
        token: string;
        roomId?: string;
      }>,
      {
        metadata: {
          displayName: string;
          address?: string;
          username?: string;
          avatar?: string;
          authId: string;
        };
        params: { isCreator: boolean; roomId: string } & Record<string, any>;
      }
    >({
      query: ({ params, ...data }) => ({
        url: `create-token?${objectToSearchParams(params)}`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Tokens" as const, id: "LIST" }]
    }),
    addUser: builder.mutation<APIResponse<USER>, NEW_USER>({
      query: (data) => ({
        url: `users`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Users" as const, id: "LIST" }]
    }),
    checkUserExist: builder.mutation<
      APIResponse<{ isNewUser: boolean }>,
      { authId?: string; username?: string; address?: string }
    >({
      query: (data) => ({
        url: `users/is-new`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Users" as const, id: "CheckUser" }]
    }),
    addNutritionist: builder.mutation<APIResponse<Nutritionist>, NEW_NUTRITIONIST>({
      query: (data) => ({
        url: `users/nutritionists`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Nutritionists" as const, id: "Nutritionists" }]
    }),
    addMeeting: builder.mutation<APIResponse<MEETING>, NEW_MEETING>({
      query: (data) => ({
        url: `meetings`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Meetings" as const, id: "Meeting" }]
    }),

    // TODO: Add return types
    createAppointment: builder.mutation<APIResponse<any>, any>({
      query: (data) => ({
        url: `appointments`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Appointments" as const, id: "Appointments" }]
    }),
    // TODO: Add return types
    createCommunity: builder.mutation<APIResponse<any>, NEW_COMMUNITY>({
      query: (data) => ({
        url: `communities`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Communities" as const, id: "Communities" }]
    }),
    joinCommunity: builder.mutation<APIResponse<any>, { communityId: number; userId: string; spaceIdOrId: string }>({
      query: ({ spaceIdOrId, ...data }) => ({
        url: `communities/${spaceIdOrId}/join`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Communities" as const, id: "Communities" }]
    }),

    checkHasJoinCommunity: builder.mutation<
      APIResponse<{ hasJoined: boolean }>,
      { communityId: number; userId: string; spaceIdOrId: string }
    >({
      query: ({ spaceIdOrId, ...data }) => ({
        url: `communities/${spaceIdOrId}/has-joined`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Communities" as const, id: "LIST" }]
    }),
    createCommunityEvent: builder.mutation<APIResponse<any>, any>({
      query: (data) => ({
        url: `community/events`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "CommunityEvents" as const, id: "LIST" }]
    }),
    createCommunityChallenge: builder.mutation<APIResponse<any>, any>({
      query: (data) => ({
        url: `community/challenges`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "CommunityChallenges" as const, id: "LIST" }]
    }),
    joinCommunityChallenge: builder.mutation<APIResponse<any>, { slugId: string; challengeId: number; userId: string }>(
      {
        query: ({ slugId, ...data }) => ({
          url: `community/challenges/${slugId}/join`,
          method: "POST",
          body: data
        }),
        invalidatesTags: [{ type: "CommunityChallenges" as const, id: "LIST" }]
      }
    ),

    checkHasJoinCommunityChallenge: builder.mutation<
      APIResponse<{ hasJoined: boolean }>,
      { slugId: string; challengeId: number; userId: string }
    >({
      query: ({ slugId, ...data }) => ({
        url: `community/challenges/${slugId}/has-joined`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "CommunityChallenges" as const, id: "LIST" }]
    }),
    joinCommunityEvent: builder.mutation<APIResponse<any>, { slugId: string; eventId: number; userId: string }>({
      query: ({ slugId, ...data }) => ({
        url: `community/events/${slugId}/join`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "CommunityEvents" as const, id: "LIST" }]
    }),
    checkHasJoinCommunityEvent: builder.mutation<
      APIResponse<{ hasJoined: boolean }>,
      { slugId: string; eventId: number; userId: string }
    >({
      query: ({ slugId, ...data }) => ({
        url: `community/events/${slugId}/has-joined`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "CommunityEvents" as const, id: "LIST" }]
    }),
    addMeetingRecord: builder.mutation<APIResponse<MEETING_RECORD>, NEW_MEETING_RECORD>({
      query: (data) => ({
        url: `meeting-records`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "MeetingRecords" as const, id: "LIST" }]
    }),
    addArticle: builder.mutation<APIResponse<Article>, NewArticle>({
      query: (data) => ({
        url: `articles`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Articles" as const, id: "LIST" }]
    })
  })
});
export const {
  useSendUserInfoToAIMutation,
  useAddNutritionistMutation,
  useCheckNutritionistStatusMutation,
  useGetNutritionistQuery,
  useGetNutritionistsQuery,
  useLazyGetNutritionistQuery,
  useJoinCommunityMutation,
  useCheckHasJoinCommunityMutation,
  useUpdateUserMutation,
  useCheckHasJoinCommunityChallengeMutation,
  useCheckHasJoinCommunityEventMutation,
  useCreateCommunityChallengeMutation,
  useCreateCommunityEventMutation,
  useJoinCommunityChallengeMutation,
  useJoinCommunityEventMutation,
  useAddFitnessPlanMutation,
  useAddMealPlanMutation,
  useGetUsersQuery,
  useCheckUserExistMutation,
  useAddMeetingMutation,
  useGetArticleQuery,
  useGetArticlesQuery,
  useAddArticleMutation,
  useGetFitnessPlanQuery,
  useGetFitnessPlansQuery,
  useGetMealPlanQuery,
  useGetMealPlansQuery,
  useLazyGetArticleQuery,
  useUpdateArticleMutation,
  useUpdateFitnessPlanMutation,
  useUpdateMealPlanMutation,
  useLazyGetArticlesQuery,
  useLazyGetFitnessPlanQuery,
  useLazyGetFitnessPlansQuery,
  useAddMeetingRecordMutation,
  useAddUserMutation,
  useCreateRoomMutation,
  useCreateTokenMutation,
  useGetMeetingRecordsQuery,
  useGetMeetingsQuery,
  useGetUserQuery,
  useLazyGetMeetingQuery,
  useLazyGetMeetingRecordsQuery,
  useLazyGetMeetingsQuery,
  useLazyGetUserQuery,
  useGetMeetingQuery,
  useCreateAppointmentMutation,
  useCreateCommunityMutation,
  useGetAppointmentQuery,
  useGetAppointmentsQuery,
  useGetCommunitiesQuery,
  useGetCommunityChallengeQuery,
  useGetCommunityChallengesQuery,
  useGetCommunityEventQuery,
  useGetCommunityEventsQuery,
  useGetCommunityMembersQuery,
  useGetCommunityMessagesQuery,
  useGetCommunityQuery,
  useLazyGetAppointmentQuery,
  useLazyGetAppointmentsQuery,
  useLazyGetCommunitiesQuery,
  useLazyGetCommunityChallengeQuery,
  useLazyGetCommunityChallengesQuery,
  useLazyGetCommunityEventQuery,
  useLazyGetCommunityEventsQuery,
  useLazyGetCommunityMembersQuery,
  useLazyGetCommunityMessagesQuery,
  useLazyGetCommunityQuery,
  usePrefetch
} = GreenSpaceDAOApi;
