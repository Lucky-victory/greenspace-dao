import { maskHexAddress } from "src/helpers";
import { PostStatus } from "src/types/shared";
import { Image, Td, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import React from "react";
import { shortenText } from "src/utils";
export default function TableItems({ dataItem, keyPrefix }: { dataItem: any; keyPrefix: string }) {
  const keys = Object.keys(dataItem);

  return keys.reduce((acc, item) => {
    const _item = item.trim();
    switch (item) {
      case "intro":
        acc.push(
          <Td
            key={`${keyPrefix}-${item}`}
            whiteSpace={"pre-wrap"}
            maxW={300}
            minW={"150px"}
            borderRadius="md"
            p={3}
            bg="var(--chakra-colors-chakra-subtle-bg)"
          >
            <Text noOfLines={3} as={"span"} fontSize={"15px"} color="var(--chakra-colors-chakra-body-text)">
              {shortenText(dataItem.intro)}
            </Text>
          </Td>
        );
        break;
      case "authorAddress":
        acc.push(
          <Td key={`${keyPrefix}-${item}`} borderRadius="md" p={3} bg="var(--chakra-colors-chakra-subtle-bg)">
            <Text noOfLines={3} as={"span"} fontSize={"15px"} color="var(--chakra-colors-chakra-body-text)">
              {maskHexAddress(dataItem.authorAddress)}
            </Text>
          </Td>
        );
        break;
      case "slug":
        acc.push(
          <Td
            key={`${keyPrefix}-${item}`}
            whiteSpace={"pre-wrap"}
            maxW={300}
            minW={"150px"}
            borderRadius="md"
            p={3}
            bg="var(--chakra-colors-chakra-subtle-bg)"
          >
            <Text noOfLines={3} as={"span"} fontSize={"15px"} color="var(--chakra-colors-chakra-body-text)">
              {shortenText(dataItem.slug)}
            </Text>
          </Td>
        );
        break;
      case "content":
        acc.push(
          <Td
            key={`${keyPrefix}-${item}`}
            whiteSpace={"pre-wrap"}
            maxW={300}
            minW={"200px"}
            borderRadius="md"
            p={3}
            bg="var(--chakra-colors-chakra-subtle-bg)"
          >
            <Text noOfLines={3} as={"span"} fontSize={"15px"} color="var(--chakra-colors-chakra-body-text)">
              {shortenText(dataItem.content, 200)}
            </Text>
          </Td>
        );
        break;
      case "title":
        acc.push(
          <Td
            key={`${keyPrefix}-${item}`}
            whiteSpace={"pre-wrap"}
            maxW={300}
            minW={"250px"}
            borderRadius="md"
            p={3}
            bg="var(--chakra-colors-chakra-subtle-bg)"
          >
            <Text
              noOfLines={3}
              as={"span"}
              fontWeight={"medium"}
              fontSize={"14px"}
              color="var(--chakra-colors-chakra-body-text)"
            >
              {shortenText(dataItem.title)}
            </Text>
          </Td>
        );
        break;
      case "image":
        acc.push(
          <Td key={`${keyPrefix}-${item}`} borderRadius="md" p={3} bg="var(--chakra-colors-chakra-subtle-bg)">
            <Image alt="" src={dataItem.image} objectFit={"cover"} w={28} borderRadius="md" />
          </Td>
        );
        break;
      case "createdAt":
        acc.push(
          <Td key={`${keyPrefix}-${item}`} borderRadius="md" p={3} bg="var(--chakra-colors-chakra-subtle-bg)">
            <Text as={"span"} fontWeight={"medium"} fontSize={"14px"} color="var(--chakra-colors-chakra-body-text)">
              {format(new Date(dataItem.createdAt), "MMM dd, yyyy hh:mm a")}
            </Text>
          </Td>
        );
        break;
      case "updatedAt":
        acc.push(
          <Td key={`${keyPrefix}-${item}`} borderRadius="md" p={3} bg="var(--chakra-colors-chakra-subtle-bg)">
            <Text as={"span"} fontWeight={"medium"} fontSize={"14px"} color="var(--chakra-colors-chakra-body-text)">
              {dataItem.updatedAt ? format(new Date(dataItem.updatedAt), "MMM dd, yyyy hh:mm a") : dataItem.updatedAt}
            </Text>
          </Td>
        );
        break;
      case "status":
        acc.push(
          <Td
            key={`${keyPrefix}-${item}`}
            fontWeight={"500"}
            borderRadius="md"
            p={3}
            bg="var(--chakra-colors-chakra-subtle-bg)"
            color="var(--chakra-colors-chakra-body-text)"
          >
            {dataItem.status}
          </Td>
        );
        break;
      default:
        acc.push(
          <Td key={`${keyPrefix}-${item}`} borderRadius="md" p={3} bg="var(--chakra-colors-chakra-subtle-bg)">
            <Text as={"span"} fontSize={"15px"} color="var(--chakra-colors-chakra-body-text)">
              {dataItem[item] + ""}
            </Text>
          </Td>
        );
        break;
    }
    return acc;
  }, [] as React.JSX.Element[]);
}
