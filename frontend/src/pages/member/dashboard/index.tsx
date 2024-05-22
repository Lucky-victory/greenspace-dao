import DashboardEmptyArea from "src/components/DashboardEmptyArea";
import DashboardLayout from "src/components/MemberDashboardLayout";
import { Box, Card, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useAuth } from "src/hooks/common";
import { useAppContext } from "src/context/state";
import { usePrivy } from "@privy-io/react-auth";
import { useStorage } from "@thirdweb-dev/react";
import { useEffect,useState } from "react";
import { useGetUserQuery } from "src/state/services";
import { RegisterFormFields } from "src/components/RegisterForm";

export default function MemberDashboardPage() {
    const { user: contextUser } = useAppContext();
    const { ready, user } = usePrivy();
    const { data } = useGetUserQuery({ usernameOrAuthId: user?.id! });
    const storage = useStorage();
    const [registerData,setRegisterData] = useState<RegisterFormFields || null>(null)

    useEffect(() => {
        if (data?.data.userCid)
            storage?.downloadJSON(data?.data.userCid).then((res) => {
                setRegisterData(res)
            });
    }, [data?.data.userCid]);

    return (
        <DashboardLayout>
            <Box className="min-h-full h-full" px={"4"} py={4}>
                <Flex direction={"column"} w={"full"} py={5} px={4} bg={"gray.700"} rounded={"md"}>
                    <Heading size="lg">Your Details</Heading>
                    <Heading size="md" color="gray.500" mt={1}>
                        Individual
                    </Heading>
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
                                    <Text>AFOR Apple</Text>
                                </Flex>
                                <Flex>
                                    <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                                        DOB:&nbsp;
                                    </Text>
                                    <Text>{new Date().toDateString()}</Text>
                                </Flex>
                                <Flex>
                                    <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                                        Country:&nbsp;
                                    </Text>
                                    <Text>Pandora</Text>
                                </Flex>
                                <Flex>
                                    <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                                        Biological Sex:&nbsp;
                                    </Text>
                                    <Text>Alien</Text>
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
                                    <Text>{1} kg</Text>
                                </Flex>
                                <Flex>
                                    <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                                        Height:&nbsp;
                                    </Text>
                                    <Text>
                                        {1}ft {2}in
                                    </Text>
                                </Flex>
                                <Flex>
                                    <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                                        Diet:&nbsp;
                                    </Text>
                                    <Text>Eat two or more servings of fruits per day</Text>
                                </Flex>
                                <Flex>
                                    <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                                        Week Activity:&nbsp;
                                    </Text>
                                    <Text>Very Active</Text>
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
                                    <Text>4 hrs</Text>
                                </Flex>
                                <Flex>
                                    <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                                        Alcohol:&nbsp;
                                    </Text>
                                    <Text>10-20 drinks a week</Text>
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
                                    <Text>Ex Smoker</Text>
                                </Flex>
                                <Flex>
                                    <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                                        Last smoke:&nbsp;
                                    </Text>
                                    <Text>Less than a week ago</Text>
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
                                    <Text>8 hrs</Text>
                                </Flex>
                                <Flex>
                                    <Text whiteSpace={"pre"} color={"gray.500"} fontWeight={"bold"}>
                                        Overral Health:&nbsp;
                                    </Text>
                                    <Text>Fair</Text>
                                </Flex>
                            </Flex>
                        </Card>
                    </Box>
                </Flex>
            </Box>
        </DashboardLayout>
    );
}

