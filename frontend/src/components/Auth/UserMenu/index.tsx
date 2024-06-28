import {
  Avatar,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from "@chakra-ui/react";
import { LogoutButton } from "../Logout";
import { Link } from "@chakra-ui/next-js";
import { usePrivy } from "@privy-io/react-auth";
import { useGetUserQuery, useLazyGetUserQuery } from "src/state/services";
import BoringAvatar from "boring-avatars";
import { useCallback, useEffect, useState } from "react";
import { USER } from "src/state/types";
export const UserMenu = () => {
  const { user, ready } = usePrivy();
  const [getUser, { isLoading }] = useLazyGetUserQuery();
  const getFirstName = (name: string) => name?.split?.(" ")[0];
  const [savedUser, setSavedUser] = useState<USER | undefined>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isNutritionist, setIsNutritionist] = useState(false);

  const getUserCb = useCallback(getUser, [user, getUser]);
  useEffect(() => {
    const fetchUser = async () => {
      if (ready && !user) return;

      await getUserCb({ usernameOrAuthId: user?.id as string }, true)
        .unwrap()
        .then((response) => {
          const savedUser = response.data!;

          setSavedUser(savedUser);
          setIsAdmin(savedUser?.role === "admin");
          setIsMember(savedUser?.userType === "member");
          setIsNutritionist(savedUser?.userType === "nutritionist");
        });
    };
    fetchUser();
  }, [user, getUserCb, ready]);

  return (
    <>
      {isLoading && (
        <Button
          rounded={"full"}
          variant={"outline"}
          colorScheme="gs-gray"
          size={"sm"}
          isLoading={isLoading}
          loadingText="Loading..."
        >
          Hi, there <BoringAvatar size={30} />
        </Button>
      )}

      {!isLoading && savedUser && (
        <Menu>
          <MenuButton
            as={Button}
            rounded={"full"}
            // variant={"outline"}
            colorScheme="gs-beige"
            // size={"sm"}
            gap={3}
          >
            <HStack>
              <Text as={"span"}>Hi, {getFirstName(savedUser?.fullName!)}</Text>
              <Avatar size={"sm"} name={savedUser?.fullName!} src={savedUser?.avatar}></Avatar>{" "}
              {/* <BsChevronDown /> */}
            </HStack>
          </MenuButton>
          {/* <Portal> */}
          <MenuList zIndex={200} rounded={"12px"}>
            <MenuGroup>
              {isMember && (
                <MenuItem as={Link} href={"/member/dashboard"}>
                  Dashboard
                </MenuItem>
              )}
              {isNutritionist && (
                <MenuItem as={Link} href={"/nutritionist/dashboard"}>
                  Dashboard
                </MenuItem>
              )}
              {isAdmin && (
                <MenuItem as={Link} href={"/admin/dashboard"}>
                  Admin Dashboard
                </MenuItem>
              )}
            </MenuGroup>
            <MenuDivider />

            <LogoutButton as={"menuitem"} />
          </MenuList>
          {/* </Portal> */}
        </Menu>
      )}
    </>
  );
};
