import {
  CSSProperties,
  MouseEvent,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";
import base58 from "bs58";
import { apiPost } from "@/utils";
import { signIn } from "next-auth/react";

type ButtonProps = PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  endIcon?: ReactElement;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  startIcon?: ReactElement;
  style?: CSSProperties;
  tabIndex?: number;
}>;
export default function WalletAdaptor(props: ButtonProps) {
  return (
    <>
      <WalletMultiButton {...props} />
    </>
  );
}
