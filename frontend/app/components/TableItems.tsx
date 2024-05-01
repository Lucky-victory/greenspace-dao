import { maskHexAddress } from "@/helpers";
import { PostStatus } from "@/types/shared";
import { Image, Td, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import React from "react";
import { shortenText } from "@/utils";
export default function TableItems({
  dataItem,
  keyPrefix,
}: {
  dataItem: any;
  keyPrefix: string;
}) {
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
          >
            <Text noOfLines={3} as={"span"} fontSize={"15px"}>
              {shortenText(dataItem.intro)}
            </Text>
          </Td>
        );
        break;
      case "authorAddress":
        acc.push(
          <Td key={`${keyPrefix}-${item}`}>
            <Text noOfLines={3} as={"span"} fontSize={"15px"}>
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
          >
            <Text noOfLines={3} as={"span"} fontSize={"15px"}>
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
          >
            <Text noOfLines={3} as={"span"} fontSize={"15px"}>
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
          >
            <Text
              noOfLines={3}
              as={"span"}
              fontWeight={"medium"}
              fontSize={"14px"}
            >
              {shortenText(dataItem.title)}
            </Text>
          </Td>
        );
        break;
      case "image":
        acc.push(
          <Td key={`${keyPrefix}-${item}`}>
            <Image alt="" src={dataItem.image} objectFit={"cover"} w={28} />
          </Td>
        );
        break;
      case "createdAt":
        acc.push(
          <Td key={`${keyPrefix}-${item}`}>
            <Text as={"span"} fontWeight={"medium"} fontSize={"14px"}>
              {format(new Date(dataItem.createdAt), "MMM dd, yyyy hh:mm a")}
            </Text>
          </Td>
        );
        break;
      case "updatedAt":
        acc.push(
          <Td key={`${keyPrefix}-${item}`}>
            <Text as={"span"} fontWeight={"medium"} fontSize={"14px"}>
              {dataItem.updatedAt
                ? format(new Date(dataItem.updatedAt), "MMM dd, yyyy hh:mm a")
                : dataItem.updatedAt}
            </Text>
          </Td>
        );
        break;

      case "status":
        acc.push(
          <Td key={`${keyPrefix}-${item}`} fontWeight={"500"}>
            {dataItem.status}
          </Td>
        );
        break;
      default:
        acc.push(
          <Td key={`${keyPrefix}-${item}`}>
            <Text as={"span"} fontSize={"15px"}>
              {dataItem[item] + ""}
            </Text>
          </Td>
        );
        break;
    }
    return acc;
  }, [] as React.JSX.Element[]);
}
