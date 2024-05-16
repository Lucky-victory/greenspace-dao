import { Button } from "@chakra-ui/react"
import { useConnectWallet} from "@privy-io/react-auth"

export const CustomConnectButton=()=>{
    const {connectWallet}=useConnectWallet()


    function handleWalletConnect(){
        connectWallet()
    }
    return (
        <Button onClick={handleWalletConnect}>Connect Wallet</Button>
    )
}