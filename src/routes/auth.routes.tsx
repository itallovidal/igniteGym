import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignIn from "@screens/signIn";
import SignUp from "@screens/signUp";
import {TAuthRoutes} from "../@types/auth.routes";

const { Navigator, Screen } = createNativeStackNavigator<TAuthRoutes>()

function AuthRoutes() {
    return (
        <Navigator screenOptions={{headerShown: false,
                                    animation: "slide_from_left"}}>
            <Screen name={'signIn'}
                    component={SignIn}
            />

            <Screen name={'signUp'}
                    component={SignUp}
            />
        </Navigator>
    );
}

export default AuthRoutes;