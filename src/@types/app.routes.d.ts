import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs'

export type TAppRoutes = {
    home: undefined,
    exercise: {
        exerciseId: string
    },
    history: undefined,
    profile: undefined
}

export type TAppNavigatorProps = BottomTabNavigationProp<TAppRoutes>