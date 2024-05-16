import { Button } from "@chakra-ui/react"
import { useLogout} from "@privy-io/react-auth"

export const LogoutButton=()=>{
    const {logout}=useLogout()


    function handleLogout(){
        logout()
    }
    return (
        <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
    )
}