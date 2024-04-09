# GreenspaceDAO x Ready to Fight Hack

Video Demo - [Demo video](https://vimeo.com/939060983) <br />
Live Link - [GreenspaceDAO dapp](https://rtfhack.vercel.app/) <br />
Pitch Deck - [Figma slides](https://www.figma.com/proto/kbNH39bNAHi5LMqBysGlHD/GreenSpaceDAO-Pitch-Deck?page-id=0%3A1&type=design&node-id=0-185&viewport=401%2C401%2C0.05&t=T8YMxu888hhtmNQn-8&scaling=scale-down-width&hide-ui=1) <br/>

## ✨ Description

[GreenspaceDAO](https://rtfhack.vercel.app/) is the first community blockchain based project powered by community and built for community to promote healthy living and achieve healthy locations where people live up to 100 years all around the world. We are trying to make sure people live healthy by incorporating healthy living habits into their lifestyle and trying to make living healthy fun again by introducing community inclusive programs like weekly challenges where people can even try to compete against each other on a leaderboard, events, video call sessions with certified nutritionists and incentivizing these nutritionists as a focal point, to improve health, productivity and making our members live happier, more fulfilled lives with a sense of purpose and belonging in their community.

Think of what we're building as AA for longevity, it's not just about wanting to live longer but having a roadmap, a mission and a group to journey with and be accountable to.

## Inspiration

People are becoming obsessed with living longer, but they don't know how, they are spending so much money on drugs and supplements, but are they really doing it correctly? We don't think so, so that's why we at GreenspaceDAO have come up with this idea to focus on nutrition and longevity. What if we can create communities that are focused on living up to 100 years.

## What we built

Our features empower personal healthy living habits by:

- Allowing users to setup meetings with nutritionists who would offer professional consultation to them.
- Providing educative articles that can inspire users to live healthier lives.
- Providing educative meal and fitness plans that paid subscribers have access to.
- Users can interact with each other in our communities and work on health goals/challenges together.
- Users can set up in real life events in communities and meet up and do healthy activities together like long walks, marathons etc.
- Providing an AI Coach that recommends personalized health advice to our users.
- Weekly community sessions with nutritionists and accountability sessions.
- Members and Nutritionists can create proposals on our DAO to vote on updates that should be added to the platform, what vital supplements research to fund etc

## 💻 How we built GreenspaceDAO

Here's a breakdown of how it was built:

1. Users can sign up with the `registerUser` function, which they will pay the subscription fee and then get onboarded into our platform to enjoy our services

2. Nutritionists can sign up with the `applyForNutritionistRole` function, which they will pass their credentials into and have their application status set to pending.

3. We will then see their application status, and after verifying their credentials and see that it's legitimate we can now approve their status by calling the `approveNutritionistRole` function, which will approve the nutritionists and set their application status as accepted, and they can now be onboarded into our platform.

4. When a user's subscription expires, their subscription status automatically expires and their access to our platform gets revoked and their user NFT gets burned automatically, this automatic nft burning functionality will be enabled by our custom cron job automation setup which calls the `revokeUser` function when their subscription elapses, they still remain members of our platform just that they can't access our services until they renew their subscription and they can now mint another user NFT

5. Users can join communities and chat in these communities, the chat feature is powered by pusher, there are also ongoing challenges and events going on in communities.

6. Our calling feature is powered by huddle01

## Where we deployed to/contract details

We created and deployed our smart contracts on the Ready to Fight Testnet Chain.

### Ready to Fight Testnet Chain

1. Treasury contract - 0x9E1eF5A92C9Bf97460Cd00C0105979153EA45b27 - [View source code](https://github.com/degencodebeast/rtfhack/blob/main/backend/contracts/Treasury.sol) | [View on Ready to Fight Chain](https://network.rtfight.com/address/0x9E1eF5A92C9Bf97460Cd00C0105979153EA45b27)

2. CommunityNetwork contract - 0x3a65168B746766066288B83417329a7F901b5569 - [View source code](https://github.com/degencodebeast/rtfhack/blob/main/backend/contracts/CommunityNetwork.sol) | [View on Ready to Fight Chain](https://network.rtfight.com/address/0x3a65168B746766066288B83417329a7F901b5569)

3. NutritionistNFT contract - 0x6D919b8dC30BEf41b56Aa8b18b2052c9459F8E9A - [View source code](https://github.com/degencodebeast/rtfhack/blob/main/backend/contracts/NutritionistNFT.sol) | [View on Ready to Fight Chain](https://network.rtfight.com/address/0x6D919b8dC30BEf41b56Aa8b18b2052c9459F8E9A)

4. UserNFT contract - 0xA39d26482B5c226Fd02A5f3e159C72ee03d63Fc0 - [View source code](https://github.com/degencodebeast/rtfhack/blob/main/backend/contracts/UserNFT.sol) | [View on Ready to Fight Chain](https://network.rtfight.com/address/0xA39d26482B5c226Fd02A5f3e159C72ee03d63Fc0)
