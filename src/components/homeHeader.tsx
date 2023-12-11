import {Heading, HStack, Text, VStack, Icon} from "native-base";
import UserPhoto from "@components/UserPhoto";
import {SignOut} from "phosphor-react-native";
import {TouchableOpacity} from "react-native";
import useAuth from "@hooks/useAuth";
import placeholderProfile from '../assets/userPhotoDefault.png'
import {useContext} from "react";
import {AuthContext} from "@contexts/authContext";
import {Api} from "@utils/axiosConfig";

function HomeHeader() {
    const {user} = useAuth()
    const {signOut} = useContext(AuthContext)

    return (
        <HStack bg={"gray.600"} pt={16} pb={5} px={8} alignItems={"center"}>
            <UserPhoto size={16}
                       source={ user.avatar
                           ? {uri: `${Api.defaults.baseURL}/avatar/${user.avatar}`} : placeholderProfile  }
                       alt={""}
                       marginRight={5}
            />
            <VStack flex={1}>
                <Text color={"gray.100"} fontSize={"md"}>Olá,</Text>
                <Heading fontSize={"md"} color={"gray.100"}>{user.name}</Heading>
            </VStack>

            <TouchableOpacity onPress={()=> signOut()}>
                <Icon
                    as={SignOut}
                    size={32}
                    color={"white"}
                />
            </TouchableOpacity>

        </HStack>
    );
}

export default HomeHeader;