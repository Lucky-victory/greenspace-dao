import { Button } from "@chakra-ui/react"
import { useLogin } from "@privy-io/react-auth"

export const LoginButton=()=>{
const {login}=useLogin()

    function handleClick(){
    login()
    }
    return <Button variant={'outline'} onClick={handleClick}>
        Log-In
    </Button>
}