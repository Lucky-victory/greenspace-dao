import ArticleCards from "src/components/ArticleCards";
import Icon from "src/components/Icon";
// import MatIcon from "../../../components/MatIcon";
import {
  Avatar,
  Box,
  Button,
  HStack,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

export default function CretorProfile() {
  const [user, setUser] = useState({
    username: "mark-andre43",
    fullName: "Mark Andre",
    shortBio:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam a ducimus laborum sed voluptatem ex nulla",
    avatar:
      "https://images.unsplash.com/photo-1564564244660-5d73c057f2d2?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    verified: true,
  });
  const [articles, setArticles] = useState([
    {
      intro: "",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt molestiae ad sint harum quisquam cupiditate sapiente dolorem itaqu consectetur autem?",
      createdAt: new Date().getTime(),
      slug: "understanding-human-psychology",
      coverImage:
        "https://images.unsplash.com/photo-1683009427513-28e163402d16?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      readTime: 4,
      title: "The Astonishing Origins of 6 Common Compound Words",
      author: {
        username: "mark-andre43",
        fullName: "Mark Andre",
        shortBio:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam a ducimus laborum sed voluptatem ex nulla",
        avatar:
          "https://images.unsplash.com/photo-1564564244660-5d73c057f2d2?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        verified: true,
      },
    },
    {
      intro: "",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt molestiae ad sint harum quisquam cupiditate sapiente dolorem itaqu consectetur autem?",
      createdAt: new Date().getTime(),
      slug: "understanding-human-psychology",
      coverImage:
        "https://images.unsplash.com/photo-1683009427513-28e163402d16?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      readTime: 4,
      title: "The Astonishing Origins of 6 Common Compound Words",
      author: {
        username: "mark-andre43",
        fullName: "Mark Andre",
        shortBio:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam a ducimus laborum sed voluptatem ex nulla",
        avatar:
          "https://images.unsplash.com/photo-1564564244660-5d73c057f2d2?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        verified: true,
      },
    },
  ]);
  return (
    <Box px={{ lg: 5, base: 4 }}>
      <Box bg={"appBlack.50"} mb={6}>
        <Stack maxW={"800px"} mx={"auto"} align={"center"} pt={10} pb={6}>
          <Avatar w={"120px"} h={"120px"} name="" src={user.avatar} />
          <Stack align={"center"}>
            <HStack>
              <Heading>{user.fullName}</Heading>
              {user?.verified && (
                <Icon name="verified" bold fill color="blue" />
              )}
            </HStack>
            <Text textAlign={"center"} maxW={500} color={"appBlack.300"}>
              {user?.shortBio}
            </Text>
            <HStack my={4}>
              <Button variant={"solid"} rounded={"full"} gap={2}>
                <Icon name="add" bold /> Follow
              </Button>
            </HStack>
            <HStack gap={4}>
              <HStack>
                <Text as={"span"} fontWeight={600}>
                  0
                </Text>
                <Text as={"span"}>Followers</Text>
              </HStack>
              <HStack>
                <Text as={"span"} fontWeight={600}>
                  0
                </Text>
                <Text as={"span"}>Following</Text>
              </HStack>
            </HStack>
          </Stack>
        </Stack>
      </Box>
      <Box>
        <Heading
          size={"md"}
          as={"h2"}
          display={"inline-block"}
          py={1}
          mb={4}
          borderBottom={"2px"}
          borderBottomColor={"appBlack.200"}
        >
          Articles by this Nutritionist
        </Heading>

        <Box>
          <ArticleCards articles={articles} />
        </Box>
      </Box>
    </Box>
  );
}
