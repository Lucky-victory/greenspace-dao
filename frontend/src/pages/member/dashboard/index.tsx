import DashboardLayout from "src/components/MemberDashboardLayout";
import { Box, Card, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";

import { usePrivy } from "@privy-io/react-auth";
import { useStorage } from "@thirdweb-dev/react";
import { useCallback, useEffect, useState } from "react";
import { useGetUserQuery } from "src/state/services";
import { MemberRegisterFormFields } from "src/components/RegisterForm";
import DashboardEmptyArea from "src/components/DashboardEmptyArea";

export default function MemberDashboardPage() {
  const { user } = usePrivy();
  const { data: userDataResponse, isLoading, isFetching } = useGetUserQuery({ usernameOrAuthId: user?.id! });
  const userData = userDataResponse?.data;
  const storage = useStorage();
  const [registerData, setRegisterData] = useState<MemberRegisterFormFields | null>(null);

  const fetchDataFromIPFSStorage = useCallback(() => {
    if (userData?.userCid) {
      storage?.downloadJSON(userData?.userCid).then((res) => {
        setRegisterData(res);
      });
    }
  }, [userData, storage]);
  useEffect(() => {
    fetchDataFromIPFSStorage();
  }, [fetchDataFromIPFSStorage]);
  useEffect(() => {}, [registerData]);

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const labelColor = useColorModeValue("gray.600", "gray.400");

  return (
    <DashboardLayout>
      <Box className="min-h-full h-full" px={"4"} py={4}>
        <DashboardEmptyArea isLoading={isLoading || isFetching} isEmpty={!isLoading && !registerData}>
          <Flex direction={"column"} w={"full"} py={5} px={4} bg={bgColor} rounded={"xl"} shadow="md">
            {!isLoading && registerData && (
              <>
                <Heading size="lg" color={textColor} mb={6}>
                  Your Details
                </Heading>

                <Box>
                  <Heading size="md" color={labelColor} mb={3} fontWeight={"bold"}>
                    General
                  </Heading>
                  <Card bg={cardBgColor} p={6} rounded="xl" shadow="sm" mb={6}>
                    <Flex wrap="wrap" justifyContent={"space-between"} gap="20px">
                      <InfoItem label="Name" value={registerData.fullName} />
                      <InfoItem label="DOB" value={registerData.birthDate || ""} />
                      <InfoItem label="Country" value={registerData.country || ""} />
                      <InfoItem label="Biological Sex" value={registerData.sex} />
                    </Flex>
                  </Card>
                  <Heading size="md" color={labelColor} mb={3} fontWeight={"bold"}>
                    Specific
                  </Heading>
                  <Card bg={cardBgColor} p={6} rounded="xl" shadow="sm" mb={6}>
                    <Flex wrap="wrap" justifyContent={"space-between"} gap="20px">
                      <InfoItem label="Weight" value={`${registerData.weight || ""} kg`} />
                      <InfoItem label="Height" value={registerData.height} />
                      <InfoItem label="Diet" value={registerData.diet} />
                      <InfoItem label="Week Activity" value={registerData.active || ""} />
                    </Flex>
                  </Card>
                  <Heading size="md" color={labelColor} mb={3} fontWeight={"bold"}>
                    Extras
                  </Heading>
                  <Card bg={cardBgColor} p={6} rounded="xl" shadow="sm" mb={6}>
                    <Flex wrap="wrap" gap="20px">
                      <InfoItem label="Sitting" value={`${registerData.sitting || ""} hrs`} />
                      <InfoItem label="Alcohol" value={registerData.alcohol || ""} />
                    </Flex>
                  </Card>
                  <Heading size="md" color={labelColor} mb={3} fontWeight={"bold"}>
                    Smoking
                  </Heading>
                  <Card bg={cardBgColor} p={6} rounded="xl" shadow="sm" mb={6}>
                    <Flex wrap="wrap" gap="20px">
                      <InfoItem label="Smoke" value={registerData.smoke} />
                      <InfoItem label="Last smoke" value={registerData.smokingStopped || ""} />
                      <InfoItem label="Smoke length" value={registerData.smokingLength || ""} />
                    </Flex>
                  </Card>
                  <Heading size="md" color={labelColor} mb={3} fontWeight={"bold"}>
                    Others
                  </Heading>
                  <Card bg={cardBgColor} p={6} rounded="xl" shadow="sm">
                    <Flex wrap="wrap" gap="20px">
                      <InfoItem label="Sleep" value={`${registerData.sleepLength || ""} hrs`} />
                      <InfoItem label="Overall Health" value={registerData.overallHealth || ""} />
                    </Flex>
                  </Card>
                </Box>
              </>
            )}
          </Flex>
        </DashboardEmptyArea>
      </Box>
    </DashboardLayout>
  );
}
const InfoItem = ({ label, value }: { label: string; value: string }) => {
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const valueColor = useColorModeValue("gray.800", "white");

  return (
    <Flex direction="column">
      <Text color={labelColor} fontWeight={"bold"} fontSize="sm">
        {label}
      </Text>
      <Text color={valueColor} fontSize="md">
        {value}
      </Text>
    </Flex>
  );
};
