import { Link } from "@chakra-ui/next-js";
import { Avatar, Box, HStack, Heading, List, ListItem, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import isEmpty from "just-is-empty";
import { useGetCommunityMembersQuery } from "src/state/services";
import { TabHeading } from "../../TabHeading";

export default function Members({ spaceIdOrId, showHeading = true }: { spaceIdOrId: string; showHeading?: boolean }) {
  const { data: communityMembersResponse } = useGetCommunityMembersQuery({
    spaceIdOrId: spaceIdOrId
  });
  const communityMembers = communityMembersResponse?.data!;

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const linkColor = useColorModeValue("blue.600", "blue.200");

  return (
    <Stack pt={2} bg={bgColor} color={textColor}>
      {showHeading && <TabHeading title="Members" />}

      {!isEmpty(communityMembers) && (
        <Stack py={4} as={List} className="is-nav">
          {communityMembers.map((member, i) => {
            return (
              <ListItem key={"member" + i}>
                <HStack gap={4}>
                  <Avatar size={"sm"} name={member?.fullName} src={member?.avatar} />{" "}
                  <Stack>
                    <Link color={linkColor} href={"/user/" + member?.username} textDecor={"none!important"}>
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
