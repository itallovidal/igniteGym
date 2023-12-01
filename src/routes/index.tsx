import {NavigationContainer, DefaultTheme} from "@react-navigation/native";
import AuthRoutes from "@routes/auth.routes";
// import AppRoutes from "@routes/app.routes";
import {Box, useTheme} from "native-base";
import {useContext} from "react";
import {AuthContext} from "@contexts/authContext";
import useAuth from "@hooks/useAuth";
import AppRoutes from "@routes/app.routes";

function Routes() {
    const NBTheme = useTheme()
    const theme = DefaultTheme
    theme.colors.background = NBTheme.colors.gray["700"]
    const {user} = useAuth()

    // console.log(user)

    return (
        <Box flex={1} bg={NBTheme.colors.gray["700"]}>
            <NavigationContainer theme={theme}>
                {user.id !== undefined ? <AppRoutes/> : <AuthRoutes/>}
            </NavigationContainer>
        </Box>

    );
}

export default Routes;