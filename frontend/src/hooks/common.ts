import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { USER_SESSION } from "src/state/types";

import { apiPost } from "src/utils";
type UpdateSession = (data?: any) => Promise<USER_SESSION | null>;

// import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";


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
  const { data, error, signMessageAsync } = useSignMessage({mutation:{

    onError(error, variables, context) {
      console.log({ error, variables, context });
    },
    onSuccess(data, variables, context) {
      console.log({ data, variables, context });
    },
  }
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
    console.log({ signed, message });
    const signedMessage = (await signMessageAsync?.({
      message: message,
    })) as unknown as any;
    console.log({ signedMessage, signed, message });

    setSigned(true);
    //const signature = base58.encode(signedMessage);
    const signature = signedMessage;
    try {
      await signIn("credentials", {
        message,
        signature,
        redirect: false,
      });
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
export const useAuth = () => {
  const { data: session, status } = useSession() as {
    status: "authenticated" | "loading" | "unauthenticated";
    data: USER_SESSION;
    update: UpdateSession;
  };
  const [user, setUser] = useState<USER_SESSION["user"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session) {
      setUser(session.user);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [session, status]);

  return {
    user,
    session,
    isAuthenticated: status === "authenticated",
    isLoading,
  };
};

export const useActiveTab = (
  paramName: string = "tab"
): [string, (tabName: string) => void] => {
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
