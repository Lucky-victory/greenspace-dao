import React from "react";
import { Box, Grid, Heading, Image, useColorModeValue } from "@chakra-ui/react";

interface HealthBrand {
  id: number;
  name: string;
  logoUrl: string;
}

const healthBrands: HealthBrand[] = [
  { id: 1, name: "MyFitnessPal", logoUrl: "/assets/myfitnesspal.png" },
  { id: 2, name: "Fitbit", logoUrl: "/assets/fitbit2.png" },
  { id: 3, name: "Herbalife", logoUrl: "/assets/herbalife.png" },
  { id: 4, name: "GNC", logoUrl: "/assets/gnc.png" },
  { id: 5, name: "Optimum Nutrition", logoUrl: "/assets/optimum-nutrition.png" },
  { id: 6, name: "Quest Nutrition", logoUrl: "/assets/quest-nutrition.png" },
  {
    id: 7,
    name: "Muscle Milk",
    logoUrl: "/assets/muscle-milk.png"
  },
  { id: 8, name: "Nature's Bounty", logoUrl: "/assets/natures-bounty.png" },
  { id: 9, name: "Centrum", logoUrl: "/assets/centrum.png" },
  { id: 10, name: "Ensure", logoUrl: "/assets/ensure.png" }
];
const HealthBrands: React.FC = () => {
  const bgColor = useColorModeValue("white", "gs-gray.900");
  const logoBgColor = useColorModeValue("gs-light.100", "gs-gray.200");
  return (
    <Box bg={bgColor} margin="0 auto" padding={4} my={4}>
      <Heading textTransform={"uppercase"} textAlign={"center"} mb={4} size={"lg"}>
        our partners
      </Heading>
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(5, 1fr)"
        }}
        gap={6}
      >
        {healthBrands.map((brand) => (
          <Box
            key={brand.id}
            display="flex"
            justifyContent="center"
            alignItems="center"
            padding={2}
            borderRadius="md"
            boxShadow="md"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
            bg={logoBgColor}
          >
            <Image
              mixBlendMode={"multiply"}
              //   bg={logoBgColor}
              src={brand.logoUrl}
              alt={`${brand.name} logo`}
              maxWidth="100%"
              maxHeight="60px"
              objectFit="cover"
            />
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default HealthBrands;
