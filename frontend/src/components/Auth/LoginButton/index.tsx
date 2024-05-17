import { Button } from "@chakra-ui/react"
import { useLogin } from "@privy-io/react-auth"

export const LoginButton=()=>{
const {login}=useLogin()

    function handleClick(){
    login()
    }
    return <Button rounded={'full'} colorScheme="black" variant={'outline'} onClick={handleClick}>
        Log-In
    </Button>
}