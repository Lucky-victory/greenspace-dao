import React from "react";
import { Box, Container, Heading, Text, Stack, Avatar, Flex, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah J.",
    role: "Busy Mom",
    content: "GreenSpace changed my life! I've lost 20 pounds and have so much more energy to keep up with my kids.",
    avatar: "/images/f-user-26.jpg"
  },
  {
    name: "Mike R.",
    role: "Office Worker",
    content:
      "The personalized meal plans and workout routines fit perfectly into my busy schedule. I feel healthier than ever!",
    avatar: "/images/user-54.jpg"
  },
  {
    name: "Emma L.",
    role: "Retiree",
    content:
      "At 65, I thought it was too late to get fit. GreenSpace proved me wrong! I'm more active and happier now.",
    avatar: "/images/man.jpg"
  }
];

const TestimonialCard = ({
  name,
  role,
  content,
  avatar
}: {
  name: string;
  role: string;
  content: string;
  avatar: string;
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Stack
      as={motion.div}
      whileHover={{ y: -5 }}
      bg={bgColor}
      boxShadow={"lg"}
      p={8}
      rounded={"xl"}
      align={"center"}
      pos={"relative"}
    >
      <Avatar src={avatar} mb={2} size={"lg"} pos={"absolute"} top={"-36px"} border={"4px"} color={borderColor} />
      <Box textAlign={"center"} mt={4} color={textColor} fontSize={"sm"} pos={"relative"}>
        <Box
          position="absolute"
          top={-2}
          left="50%"
          transform="translateX(-50%) rotate(45deg)"
          w={4}
          h={4}
          bg={bgColor}
        />
        <Text>{content}</Text>
      </Box>
      <Stack spacing={-1} align={"center"} mt={8}>
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize={"sm"} color={textColor}>
          {role}
        </Text>
      </Stack>
    </Stack>
  );
};

export default function TestimonialsSection() {
  return (
    <Box bg={useColorModeValue("gray.100", "gray.700")}>
      <Container
        maxW={"7xl"}
        py={16}
        as={motion.div}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
        }}
      >
        <Flex textAlign={"center"} pt={10} justifyContent={"center"} direction={"column"} width={"full"} mb={20}>
          <Heading
            as={motion.h2}
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 }
            }}
            fontSize={"3xl"}
            fontWeight={"bold"}
          >
            Real People, Real Results
          </Heading>
          <Text fontSize={"xl"} mt={4}>
            Hear from our community members who&apos;ve transformed their lives with GreenSpace
          </Text>
        </Flex>
        <Stack direction={{ base: "column", md: "row" }} spacing={{ base: 16, md: 4, lg: 10 }} mt={20}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
