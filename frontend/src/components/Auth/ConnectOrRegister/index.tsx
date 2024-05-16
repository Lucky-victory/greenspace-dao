import { usePrivy } from "@privy-io/react-auth"
import { LogoutButton } from "../Logout";
import { CustomConnectButton } from "../ConnectButton";
import { useWallet } from "src/context/WalletProvider";
import { LoginAndRegisterButtons } from "../LoginAndRegisterButtons";

export const ConnectOrLogout=({openModal}:{openModal:()=>void})=>{
    const {ready,user}=usePrivy()

const {address}=useWallet()
    return (
        <>
        {(ready && !address)&&<CustomConnectButton/>}
        {(ready && address && !user)&& <LoginAndRegisterButtons openModal={openModal}/>  }
        
        </>
    )
}