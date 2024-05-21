import { HStack } from "@chakra-ui/react"
import { LoginButton } from "../LoginButton"
import { RegisterButton } from "../RegisterButton"

export const LoginAndRegisterButtons=({openModal}:{openModal:()=>void})=>{
  function handleClick(){
        openModal?.()
    }
    return <HStack>
        <LoginButton />
        <RegisterButton onClick={handleClick}/>
    </HStack>
}