import { Link } from "@chakra-ui/next-js";
import {
  Avatar,
  Box,
  HStack,
  Heading,
  List,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/react";
import isEmpty from "just-is-empty";
import { useGetCommunityMembersQuery } from "src/state/services";
import { TabHeading } from "../../TabHeading";

export default function Members({
  spaceIdOrId,
  showHeading = true,
}: {
  spaceIdOrId: string;
  showHeading?: boolean;
}) {
  const { data: communityMembersResponse } = useGetCommunityMembersQuery({
    spaceIdOrId: spaceIdOrId,
  });
  const communityMembers = communityMembersResponse?.data!;
  return (
    <Stack pt={2}>
      {showHeading && <TabHeading title="Members" />}

      {!isEmpty(communityMembers) && (
        <Stack py={4} as={List}>
          {communityMembers.map((member, i) => {
            return (
              <ListItem key={"member" + i}>
                <HStack gap={4}>
                  <Avatar
                    size={"sm"}
                    name={member?.fullName}
                    src={member?.avatar}
                  />{" "}
                  <Stack>
                    <Link
                      color={"gray.400"}
                      href={"/user/" + member?.username}
                      textDecor={"none!important"}
                    >
                      <Text fontWeight={500}>{member?.fullName}</Text>
                    </Link>
                  </Stack>
                </HStack>
              </ListItem>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
