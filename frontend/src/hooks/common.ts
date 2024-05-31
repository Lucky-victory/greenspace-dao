import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { USER_SESSION } from "src/state/types";

import { apiPost } from "src/utils";
type UpdateSession = (data?: any) => Promise<USER_SESSION | null>;

import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";

import TurndownService from "turndown";

export function useHTMLToMarkdownConverter() {
  const [html, setHtml] = useState("");
  const [markdown, setMarkdown] = useState("");
  const turndownService = new TurndownService();

  // Add rules to handle specific HTML elements or attributes
  turndownService.addRule("heading", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function (content, node, options) {
      const hLevel = +node.nodeName.charAt(1);
      const hPrefix = "#".repeat(hLevel);
      return `\n\n${hPrefix} ${content}\n\n`;
    },
  });

  turndownService.addRule("paragraph", {
    filter: "p",
    replacement: function (content) {
      return `\n\n${content}\n\n`;
    },
  });

  useEffect(() => {
    if (html) {
      setMarkdown(turndownService.turndown(html));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html]);

  const updateHtml = useCallback((newHtml: string) => {
    setHtml(newHtml);
  }, []);

  return { markdown, updateHtml };
}
export const useScrollToBottom = (triggerOnLoad = false) => {
  const chatContainerRef = useRef<any>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (triggerOnLoad) {
      scrollToBottom();
    }
  }, [triggerOnLoad]);

  const scrollToBottomOnNewMessage = () => {
    scrollToBottom();
  };

  return {
    containerRef: chatContainerRef,
    scrollToBottom: scrollToBottomOnNewMessage,
  };
};
/**
 * Used to check if the user is logged in
 * @returns
 */
export const useInAppAuth = () => {
  const { ready, user, login } = usePrivy();

  function connect() {
    if (!user) {
      login();
    }
  }
  useEffect(() => {}, [user, ready]);
  return {
    user,
    connect,
    isLoggedIn: !!user,
  };
};
export const useWalletAccount = () => {
  const [_address, setAddress] = useState<string | null>(null);

  const { connectAsync } = useConnect();
  // const { isLoading } = useDisconnect();
  const { isConnected, address } = useAccount();

  //const { publicKey } = useWallet();
  //const address = publicKey?.toBase58();
  useEffect(() => {
    if (address) {
      setAddress(address);
    } else {
      setAddress(null);
    }
  }, [address]);

  return { address: _address };
};
export function useCustomSign() {
  //const { publicKey, signMessage } = useWallet();
  // const { connectAsync } = useConnect();
  const { data, error, signMessageAsync } = useSignMessage({
    mutation: {
      onError(error, variables, context) {},
      onSuccess(data, variables, context) {},
    },
  });

  const { isConnected, address } = useAccount();
  const { chain } = useAccount();

  // const { account, chain } = await connectAsync({
  //   connector: new MetaMaskConnector(),
  // });

  const [signed, setSigned] = useState(false);

  const signCustomMessage = async () => {
    //const address = publicKey?.toBase58();
    //const chain = "solana";

    const account = {
      address: address,
      chainId: chain?.id,
      network: chain?.name,
    };
    // const message = "Sign to provide access to app";
    const { message } = await apiPost("api/auth/request-message", account);
    // const encodedMessage = new TextEncoder().encode(message);
    // const signedMessage = signMessage?.(encodedMessage) as unknown;

    const signedMessage = (await signMessageAsync?.({
      message: message,
    })) as unknown as any;

    setSigned(true);
    //const signature = base58.encode(signedMessage);
    const signature = signedMessage;
    try {
      // await signIn("credentials", {
      //   message,
      //   signature,
      //   redirect: false,
      // });
    } catch (e) {
      console.log(e);
      return;
    }
  };

  useEffect(() => {
    address ? !signed && signCustomMessage() : setSigned(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return { signed, setSigned, signCustomMessage };
}
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const useActiveTab = (paramName: string = "tab"): [string, (tabName: string) => void] => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const { query } = router;
    const activeTabParam = query[paramName] as string;
    setActiveTab(activeTabParam || ""); // Set active tab from URL query params
  }, [router, paramName]);

  const setActiveTabAndUpdateUrl = (tabName: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, [paramName]: tabName },
      },
      undefined,
      { shallow: true }
    );
    setActiveTab(tabName);
  };

  return [activeTab, setActiveTabAndUpdateUrl];
};

export const useResize = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    //@ts-ignore
    width: undefined,
    //@ts-ignore
    height: undefined,
  });
  const isMobileSize = windowSize?.width < 560;
  const isTabletSize = windowSize?.width > 560 && windowSize?.width <= 960;

  useEffect(() => {
    // Function to update window size
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial window size update
    updateWindowSize();

    // Event listener to update window size on resize
    window.addEventListener("resize", updateWindowSize);

    // Clean-up function to remove event listener
    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []); // Run only once on component mount

  return { ...windowSize, isMobileSize, isTabletSize };
};
