import DashboardLayout from "src/components/MemberDashboardLayout";
import { Box, Card, Flex, Heading, Text } from "@chakra-ui/react";

import { usePrivy } from "@privy-io/react-auth";
import { useStorage } from "@thirdweb-dev/react";
import { useCallback, useEffect, useState } from "react";
import { useGetUserQuery } from "src/state/services";
import { RegisterFormFields } from "src/components/RegisterForm";
import DashboardEmptyArea from "src/components/DashboardEmptyArea";

export default function MemberDashboardPage() {
  const { user } = usePrivy();
  const { data: userDataResponse, isLoading, isFetching } = useGetUserQuery({ usernameOrAuthId: user?.id! });
  const userData = userDataResponse?.data;
  const storage = useStorage();
  const [registerData, setRegisterData] = useState<RegisterFormFields | null>(null);

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
  return (
    <DashboardLayout>
      <Box className="min-h-full h-full" px={"4"} py={4}>
        <DashboardEmptyArea isLoading={isLoading || isFetching} isEmpty={!isLoading && !registerData}>
          <Flex direction={"column"} w={"full"} py={5} px={4} bg={"gray.700"} rounded={"md"}>
            {!isLoading && registerData && (
              <>
                <Heading size="lg">Your Details</Heading>

                <Box pt={5}>
                  <Heading size="md" color="gray.300" mb={2} fontWeight={"bold"}>
                    General
                  </Heading>
                  <Card bg={"gray.800"} p={4}>
                    <Flex wrap="wrap" justifyContent={"space-between"} gap="20px">
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          Name:&nbsp;
                        </Text>
                        <Text>{registerData.fullName}</Text>
                      </Flex>
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          DOB:&nbsp;
                        </Text>
                        <Text>{registerData?.birthDate}</Text>
                      </Flex>
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          Country:&nbsp;
                        </Text>
                        <Text>{registerData?.country}</Text>
                      </Flex>
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          Biological Sex:&nbsp;
                        </Text>
                        <Text>{registerData.sex}</Text>
                      </Flex>
                    </Flex>
                  </Card>
                  <Heading size="md" color="gray.300" mb={2} mt={4} fontWeight={"bold"}>
                    Specific
                  </Heading>
                  <Card bg={"gray.800"} p={4}>
                    <Flex wrap="wrap" justifyContent={"space-between"} gap="20px">
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          Weight:&nbsp;
                        </Text>
                        <Text>{registerData?.weight} kg</Text>
                      </Flex>
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          Height:&nbsp;
                        </Text>
                        <Text>
                          {registerData.height}
                          {/* {1}ft {2}in */}
                        </Text>
                      </Flex>
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          Diet:&nbsp;
                        </Text>
                        <Text>{registerData.diet}</Text>
                      </Flex>
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          Week Activity:&nbsp;
                        </Text>
                        <Text>{registerData?.active}</Text>
                      </Flex>
                    </Flex>
                  </Card>
                  <Heading size="md" color="gray.300" mb={2} mt={4} fontWeight={"bold"}>
                    Extras
                  </Heading>
                  <Card bg={"gray.800"} p={4}>
                    <Flex wrap="wrap" gap="20px">
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          Sitting:&nbsp;
                        </Text>
                        <Text>{registerData?.sitting} hrs</Text>
                      </Flex>
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          Alcohol:&nbsp;
                        </Text>
                        <Text>{registerData?.alcohol}</Text>
                      </Flex>
                    </Flex>
                  </Card>
                  <Heading size="md" color="gray.300" mb={2} mt={4} fontWeight={"bold"}>
                    Smoking
                  </Heading>
                  <Card bg={"gray.800"} p={4}>
                    <Flex wrap="wrap" gap="20px">
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          Smoke:&nbsp;
                        </Text>
                        <Text>{registerData.smoke}</Text>
                      </Flex>
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          Last smoke:&nbsp;
                        </Text>
                        <Text>{registerData?.smokingStopped}</Text>
                      </Flex>
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          Smoke length:&nbsp;
                        </Text>
                        <Text>{registerData?.smokingLength}</Text>
                      </Flex>
                    </Flex>
                  </Card>
                  <Heading size="md" color="gray.300" mb={2} mt={4} fontWeight={"bold"}>
                    Others
                  </Heading>
                  <Card bg={"gray.800"} p={4}>
                    <Flex wrap="wrap" gap="20px">
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          Sleep:&nbsp;
                        </Text>
                        <Text>{registerData?.sleepLength} hrs</Text>
                      </Flex>
                      <Flex>
                        <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                          Overral Health:&nbsp;
                        </Text>
                        <Text>{registerData?.overallHealth}</Text>
                      </Flex>
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
