import {
  generateCommunityId,
  generateNumId,
  generateUrlSafeId,
  generateUsername,
} from "@/utils";
import { relations } from "drizzle-orm";
import {
  index,
  int,
  longtext,
  mediumtext,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  uniqueIndex,
  primaryKey,
  varchar,
  boolean,
  text,
  time,
  datetime,
} from "drizzle-orm/mysql-core";

export const global = mysqlTable("global", {
  id: serial("id").primaryKey(),
  greenspaceAIId: mediumtext("greenspace_ai_id"),
});
export const articles = mysqlTable(
  "Articles",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 120 }).notNull(),
    intro: varchar("intro", { length: 255 }),
    image: mediumtext("image"),
    slug: varchar("slug", { length: 255 }).notNull(),
    content: longtext("content"),
    status: mysqlEnum("status", ["published", "draft", "deleted"]).default(
      "draft"
    ),
    views: int("views").default(0),
    userId: varchar("user_id", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (t) => ({
    titleIdx: index("title_idx").on(t.title),
    slugIdx: index("slug_idx").on(t.slug),
    userIdx: index("user_idx").on(t.userId),
  })
);
export const mealPlans = mysqlTable(
  "MealPlans",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 120 }).notNull(),
    intro: varchar("intro", { length: 255 }),
    image: mediumtext("image"),
    slug: varchar("slug", { length: 255 }).notNull(),
    content: longtext("content"),
    status: mysqlEnum("status", ["published", "draft", "deleted"]).default(
      "draft"
    ),
    views: int("views").default(0),
    time: varchar("time", {
      enum: ["breakfast", "lunch", "dinner", "snack"],
      length: 50,
    }).notNull(),

    userId: varchar("user_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (t) => ({
    userIdx: index("user_idx").on(t.userId),
    titleIdx: index("title_idx").on(t.title),
    slugIdx: index("slug_idx").on(t.slug),
  })
);
export const fitnessPlans = mysqlTable(
  "FitnessPlans",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 120 }).notNull(),
    views: int("views").default(0),
    image: mediumtext("image"),
    slug: varchar("slug", { length: 255 }).notNull(),
    content: longtext("content"),
    status: mysqlEnum("status", ["published", "draft", "deleted"]).default(
      "draft"
    ),
    userId: varchar("user_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (t) => ({
    titleIdx: index("title_idx").on(t.title),
    slugIdx: index("slug_idx").on(t.slug),
  })
);
export const nutritionists = mysqlTable("Nutritionists", {
  bio: varchar("bio", { length: 255 }),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 255 }),
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 50 })
    .unique()
    .$defaultFn(() => generateUsername("GN_")),
  userType: mysqlEnum("user_type", ["member", "nutritionist"])
    .default("nutritionist")
    .notNull(),
  sex: mysqlEnum("sex", ["male", "female", "other"]),
  birthDate: datetime("birth_date"),
  fullName: varchar("full_name", { length: 255 }),
  avatar: varchar("avatar", { length: 255 }),
  authId: varchar("auth_id", { length: 255 }).$defaultFn(generateUrlSafeId),
  emailVerified: boolean("email_verified").default(false),
  verificationStatus: mysqlEnum("verification_status", [
    "verified",
    "pending",
    "rejected",
  ]).default("pending"),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
export const users = mysqlTable(
  "Users",
  {
    id: int("id").autoincrement().primaryKey(),
    chainId: varchar("chain_id", { length: 100 }),
    aiCoachThreadIds: longtext("ai_coach_thread_ids"),
    //this can be used as a user id from a third party auth provider
    authId: varchar("auth_id", { length: 255 }).$defaultFn(generateUrlSafeId),
    emailVerified: boolean("email_verified").default(false),
    fullName: varchar("full_name", { length: 120 }),
    username: varchar("username", { length: 50 })
      .unique()
      .notNull()
      .$defaultFn(generateUsername),
    password: varchar("password", { length: 255 }),
    email: varchar("email", { length: 255 }).unique(),
    address: varchar("address", { length: 100 }).default(""),
    avatar: varchar("avatar", { length: 255 }),
    userType: mysqlEnum("user_type", ["member", "nutritionist"])
      .default("member")
      .notNull(),
    role: mysqlEnum("role", ["admin", "user"]).default("user"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.address, t.authId] }),
    emailIdx: index("email_idx").on(t.email),
    userTypeIdx: index("user_type_idx").on(t.userType),
    addressIdx: index("address_idx").on(t.address),

    usernameIdx: uniqueIndex("username_idx").on(t.username),
  })
);

export const meetingRecords = mysqlTable(
  "MeetingRecords",
  {
    id: int("id").autoincrement().primaryKey(),
    meetingId: varchar("meeting_id", { length: 100 }),
    userId: varchar("user_id", { length: 255 }),
    recordDuration: int("record_duration"),
    recordUri: varchar("record_uri", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (t) => ({
    userIdx: index("user_idx").on(t.userId),
  })
);
export const meetings = mysqlTable(
  "Meetings",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }),
    meetId: varchar("meet_id", { length: 255 }).$defaultFn(() =>
      generateUrlSafeId(14)
    ),
    startTime: datetime("start_time"),
    endTime: datetime("end_time"),
    roomId: varchar("room_id", { length: 100 }).notNull(),
    userId: varchar("user_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (t) => ({
    userIdx: index("user_idx").on(t.userId),
    roomIdx: index("room_idx").on(t.roomId),
  })
);
export const communities = mysqlTable("Communities", {
  id: int("id").autoincrement().primaryKey(),
  spaceId: varchar("space_id", { length: 150 }).$defaultFn(generateCommunityId),
  status: mysqlEnum("status", ["published", "draft", "deleted"]).default(
    "published"
  ),
  views: int("views").default(0),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  visibility: mysqlEnum("visibility", ["public", "private"]).default("public"),
  slug: varchar("slug", { length: 255 }),
  displayImage: varchar("display_image", { length: 255 }),
  coverImage: varchar("cover_image", { length: 255 }),
  userId: varchar("user_id", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const communityMessages = mysqlTable("CommunityMessages", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("community_id"),
  userId: varchar("user_id", { length: 255 }),
  message: mediumtext("message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});
export const messageAttachments = mysqlTable("MessageAttachments", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("message_id"),
  content: text("content"),
  type: varchar("type", { length: 20 }),
});
export const communityEvents = mysqlTable("CommunityEvents", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  details: mediumtext("details"),
  slugId: varchar("slug_id", { length: 255 }).$defaultFn(() =>
    generateUrlSafeId(14)
  ),
  coverImage: mediumtext("cover_image"),
  communityId: int("community_id"),
  startDate: datetime("start_date"),
  endDate: datetime("end_date"),
  venue: varchar("venue", {
    enum: ["online", "in-person"],
    length: 255,
  }).default("online"),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});
export const communityChallenges = mysqlTable("CommunityChallenges", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slugId: varchar("slug_id", { length: 255 }).$defaultFn(() =>
    generateUrlSafeId(14)
  ),
  details: mediumtext("details"),
  coverImage: mediumtext("cover_image"),
  communityId: int("community_id"),
  startDate: datetime("start_date"),
  endDate: datetime("end_date"),
  venue: varchar("venue", {
    enum: ["online", "in-person"],
    length: 255,
  }).default("online"),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});
export const communityMembers = mysqlTable("CommunityMembers", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("community_id"),
  userId: varchar("user_id", { length: 255 }),
  role: mysqlEnum("role", ["moderator", "admin", "member"]).default("member"),
  xp: int("xp").default(0),
  joinedOn: timestamp("joined_on").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});
export const communityEventsTags = mysqlTable("CommunityEventsTags", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("event_id"),
  name: varchar("name", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});
export const communityChallengesTags = mysqlTable("CommunityChallengesTags", {
  id: int("id").autoincrement().primaryKey(),
  challengeId: int("challenges_id"),
  name: varchar("name", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});
// Appointments
export const appointments = mysqlTable("Appointments", {
  id: int("id").autoincrement().primaryKey(),
  requestedBy: varchar("requested_by", { length: 155 }),
  nutritionistId: varchar("nutritionist_id", { length: 155 }),
  status: mysqlEnum("status", [
    "pending",
    "accepted",
    "rejected",
    "expired",
    "completed",
  ]).default("pending"),
  slugId: varchar("slug_id", { length: 255 }).$defaultFn(() =>
    generateUrlSafeId(14)
  ),
  startTime: datetime("start_time"),
  endTime: datetime("end_time"),
  duration: int("duration"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});
export const meetingParticipants = mysqlTable("MeetingParticipants", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("user_id", { length: 155 }),
  meetingId: varchar("meeting_id", { length: 100 }),
});

// relations
export const appointmentsRelations = relations(
  appointments,
  ({ one, many }) => ({
    requestedBy: one(users, {
      fields: [appointments.requestedBy],
      references: [users.authId],
    }),
    nutritionist: one(nutritionists, {
      fields: [appointments.nutritionistId],
      references: [nutritionists.authId],
    }),
  })
);
export const communityRelations = relations(communities, ({ one, many }) => ({
  events: many(communityEvents),
  challenges: many(communityChallenges),
  messages: many(communityMessages),
  members: many(communityMembers),
  author: one(users, {
    fields: [communities.userId],
    references: [users.authId],
  }),
}));
export const communityChallengesRelations = relations(
  communityChallenges,
  ({ one, many }) => ({
    tags: many(communityChallengesTags),
    community: one(communities, {
      fields: [communityChallenges.communityId],
      references: [communities.id],
    }),
  })
);
export const communityChallengesTagsRelations = relations(
  communityChallengesTags,
  ({ one, many }) => ({
    challenges: one(communityChallenges, {
      fields: [communityChallengesTags.challengeId],
      references: [communityChallenges.id],
    }),
  })
);
export const communityEventsTagsRelations = relations(
  communityEventsTags,
  ({ one, many }) => ({
    challenges: one(communityEvents, {
      fields: [communityEventsTags.eventId],
      references: [communityEvents.id],
    }),
  })
);
export const communityEventsRelations = relations(
  communityEvents,
  ({ one, many }) => ({
    tags: many(communityEventsTags),
    community: one(communities, {
      fields: [communityEvents.communityId],
      references: [communities.id],
    }),
  })
);
export const communityMembersRelations = relations(
  communityMembers,
  ({ one, many }) => ({
    user: one(users, {
      fields: [communityMembers.userId],
      references: [users.authId],
    }),

    community: one(communities, {
      fields: [communityMembers.communityId],
      references: [communities.id],
    }),
  })
);
export const messageAttachmentsRelations = relations(
  messageAttachments,
  ({ one, many }) => ({
    message: one(communityMessages, {
      fields: [messageAttachments.messageId],
      references: [communityMessages.id],
    }),
  })
);
export const communityMessagesRelations = relations(
  communityMessages,
  ({ one, many }) => ({
    author: one(users, {
      fields: [communityMessages.userId],
      references: [users.authId],
    }),
    community: one(communities, {
      fields: [communityMessages.communityId],
      references: [communities.id],
    }),
    attachments: many(messageAttachments),
  })
);

export const meetingParticipantsRelations = relations(
  meetingParticipants,
  ({ one }) => ({
    user: one(users, {
      fields: [meetingParticipants.userId],
      references: [users.authId],
    }),
    meeting: one(meetings, {
      fields: [meetingParticipants.meetingId],
      references: [meetings.id],
    }),
  })
);
export const meetingRelations = relations(meetings, ({ one, many }) => ({
  records: many(meetingRecords),
  author: one(users, {
    fields: [meetings.userId],
    references: [users.authId],
  }),
  participants: many(meetingParticipants),
  // // this and the above references a user, this for a local auth, while the other is for a third party auth
  // author: one(users, {
  //   fields: [meetings.userId],
  //   references: [users.authId],
  // }),
}));
export const meetingRecordsRelations = relations(
  meetingRecords,
  ({ one, many }) => ({
    records: many(meetingRecords),
    author: one(users, {
      fields: [meetingRecords.userId],
      references: [users.authId],
    }),
    // // this and the above references a user, this for a local auth, while the other is for a third party auth
    // author: one(users, {
    //   fields: [meetingRecords.userId],
    //   references: [users.id],
    // }),
  })
);
export const userRelations = relations(users, ({ one, many }) => ({
  fitnessPlans: many(fitnessPlans),
  mealPlans: many(mealPlans),
  articles: many(articles),
  meeting: many(meetings),
  communities: many(communities),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, {
    fields: [articles.userId],
    references: [users.authId],
  }),
}));
export const mealPlansRelations = relations(mealPlans, ({ one, many }) => ({
  author: one(users, {
    fields: [mealPlans.userId],
    references: [users.authId],
  }),
}));
export const fitnessPlansRelations = relations(
  fitnessPlans,
  ({ one, many }) => ({
    author: one(users, {
      fields: [fitnessPlans.userId],
      references: [users.authId],
    }),
  })
);
