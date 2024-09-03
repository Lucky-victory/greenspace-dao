import {
  type ComponentWithAs,
  Link,
  Text,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  Image,
  useColorModeValue
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HTMLChakraProps, ThemingProps } from "@chakra-ui/system";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

interface BlockQuoteProps extends HTMLChakraProps<"blockquote">, ThemingProps<"Container"> {
  align?: string;
}
const BlockQuote = Box as ComponentWithAs<"blockquote", BlockQuoteProps>;

const MarkdownRenderer: React.FC<{ markdown: string }> = ({ markdown }) => {
  const linkColor = useColorModeValue("blue.600", "blue.300");
  const tableBorderColor = useColorModeValue("gray.200", "gray.600");
  const blockquoteBg = useColorModeValue("gray.100", "gray.700");
  const blockquoteBorderColor = useColorModeValue("gray.300", "gray.500");

  return (
    <ReactMarkdown
      // eslint-disable-next-line react/no-children-prop
      children={markdown}
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node, ...props }) => <Link {...props} color={linkColor} isExternal />,
        p: ({ node, ...props }) => <Text {...props} fontSize="md" my={3} />,
        b: ({ node, ...props }) => <Text as="b" {...props} fontWeight="semibold" />,
        strong: ({ node, ...props }) => <Text as="strong" {...props} fontWeight="semibold" />,
        table: ({ node, ...props }) => (
          <TableContainer my={8} borderRadius="md" border="1px" borderColor={tableBorderColor} py={4}>
            <Table {...props} variant="simple" />
          </TableContainer>
        ),
        caption: ({ node, ...props }) => <TableCaption {...props} />,
        //@ts-ignore
        ul: ({ node, ordered, className, ...props }) =>
          className === "contains-task-list" ? (
            <List className={className} {...props} />
          ) : (
            <List className={className} {...props} spacing={2} />
          ),
        //@ts-ignore

        ol: ({ node, ordered, className, ...props }) =>
          className === "contains-task-list" ? (
            <List className={className} {...props} />
          ) : (
            <OrderedList className={className} {...props} spacing={2} />
          ),
        //@ts-ignore

        li: ({ ordered, node, checked, className, ...props }) =>
          className === "task-list-item" ? (
            <ListItem className={className} {...props}>
              <ListIcon as={checked ? MdCheckBox : MdCheckBoxOutlineBlank} /> {props.children}
            </ListItem>
          ) : (
            <ListItem className={className} {...props} />
          ),
        //@ts-ignore

        th: ({ node, isHeader, ...props }) => <Th fontSize="sm" {...props} />,

        td: ({ node, ...props }) => <Td {...props} />,
        //@ts-ignore
        tr: ({ node, isHeader, ...props }) => <Tr {...props} />,
        tbody: ({ node, ...props }) => <Tbody {...props} />,
        thead: ({ node, ...props }) => <Thead {...props} />,
        tfoot: ({ node, ...props }) => <Tfoot {...props} />,
        img: ({ node, alt, ...props }) => <Image alt={alt} {...props} maxWidth="100%" height="auto" />,
        h1: ({ node, ...props }) => <Heading as="h1" size="2xl" mt={8} mb={4} {...props} />,
        h2: ({ node, ...props }) => <Heading as="h2" size="xl" mt={6} mb={3} {...props} />,
        h3: ({ node, ...props }) => <Heading as="h3" size="lg" mt={5} mb={2} {...props} />,
        h4: ({ node, ...props }) => <Heading as="h4" size="md" mt={4} mb={2} {...props} />,
        h5: ({ node, ...props }) => <Heading as="h5" size="sm" mt={3} mb={2} {...props} />,
        h6: ({ node, ...props }) => <Heading as="h6" size="xs" mt={2} mb={1} {...props} />,
        blockquote: ({ node, ...props }) => (
          <BlockQuote
            borderLeft="4px"
            borderTopLeftRadius="md"
            borderBottomLeftRadius="md"
            borderColor={blockquoteBorderColor}
            as="blockquote"
            {...props}
            my={6}
            pl={{ base: 4, md: 6 }}
            maxW="100%"
            py={3}
            pr={3}
            bg={blockquoteBg}
          />
        )
      }}
    />
  );
};

export default MarkdownRenderer;
