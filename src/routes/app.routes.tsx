import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Home from "@screens/home";
import Profile from "@screens/profile";
import History from "@screens/history";
import Exercise from "@screens/exercise";
import {ClockCounterClockwise, House, UserCircle} from "phosphor-react-native";
import {useTheme} from "native-base";
import {TAppRoutes} from "../@types/app.routes";

const {Navigator, Screen} = createBottomTabNavigator<TAppRoutes>()

function AppRoutes(){
    const {colors} = useTheme()

    return (
        <Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: colors.green["700"],
            tabBarInactiveTintColor: colors.gray["200"],

            tabBarStyle: {
                backgroundColor: colors.gray["600"],
                borderTopWidth: 0,
                paddingBottom: 36,
                paddingTop: 36,
                height: "auto"
            }
            }}>
            <Screen name={'home'}
                    component={Home}
                    options={{
                        tabBarIcon: ({color})=> <House color={color} size={32} />,
                    }}
            />
            <Screen name={'history'}
                    component={History}
                    options={{
                        tabBarIcon: ({color})=> <ClockCounterClockwise color={color} size={32} />,
                    }}
            />
            <Screen name={'profile'}
                    component={Profile}
                    options={{
                        tabBarIcon: ({color})=> <UserCircle color={color} size={32} />
                    }}
            />
            <Screen name={'exercise'}
                    component={Exercise}
                    options={{
                        tabBarButton: ()=> null
                    }}
            />
        </Navigator>
    )
}

export default AppRoutes;