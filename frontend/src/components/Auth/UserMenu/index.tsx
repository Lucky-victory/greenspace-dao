import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { LogoutButton } from "../Logout";
import { Link } from "@chakra-ui/next-js";
import { usePrivy } from "@privy-io/react-auth";
import { useGetUserQuery } from "src/state/services";
import BoringAvatar from "boring-avatars";
export const UserMenu = () => {
  const { user } = usePrivy();
  const { data: savedUserResponse, isLoading } = useGetUserQuery({
    usernameOrAuthId: user?.id as string,
  });
  const getFirstName = (name: string) => name.split(" ")[0];
  const savedUser = savedUserResponse?.data;
  const isAdmin = savedUser?.role === "admin";
  const isMember = savedUser?.userType === "member";
  const isNutritionist = savedUser?.userType === "nutritionist";
  return (
    <Menu>
      {isLoading && (
        <MenuButton
          as={Button}
          rounded={"full"}
          variant={"outline"}
          colorScheme="gs-gray"
          size={"sm"}
          isLoading={isLoading}
          loadingText="Loading..."
        >
          Hi, there <BoringAvatar size={30} />
        </MenuButton>
      )}
      {!isLoading && user && (
        <>
          <MenuButton
            as={Button}
            rounded={"full"}
            variant={"outline"}
            colorScheme="gs-gray"
            size={"sm"}
            gap={3}
          >
            <Text>Hi, {getFirstName(savedUser?.fullName!)}</Text>
            <Avatar
              size={"sm"}
              name={savedUser?.fullName!}
              src={savedUser?.avatar}
            ></Avatar>
          </MenuButton>
          <MenuList>
            <MenuGroup>
              <MenuItem>
                {isMember && (
                  <Button
                    rounded={"full"}
                    variant={"ghost"}
                    colorScheme="gs-gray"
                    size={"sm"}
                    as={Link}
                    href={"/member/dasboard"}
                  >
                    Dashboard
                  </Button>
                )}
                {isNutritionist && (
                  <Button
                    rounded={"full"}
                    variant={"ghost"}
                    colorScheme="gs-gray"
                    size={"sm"}
                    as={Link}
                    href={"/nutritionist/dasboard"}
                  >
                    Dashboard
                  </Button>
                )}
              </MenuItem>
              {isAdmin && (
                <MenuItem>
                  <Button
                    rounded={"full"}
                    variant={"ghost"}
                    colorScheme="gs-gray"
                    size={"sm"}
                    as={Link}
                    href={"/admin/dasboard"}
                  >
                    Admin Dashboard
                  </Button>
                </MenuItem>
              )}
            </MenuGroup>
            <MenuItem>
              <LogoutButton />
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};
