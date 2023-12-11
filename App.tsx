

import {StatusBar} from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import {NativeBaseProvider} from "native-base";
import Loading from "@components/Loading";
import {THEME} from "./src/theme";
import SignUp from "@screens/signUp";
import Routes from "@routes/index";
import AuthContextProvider, {AuthContext} from "./src/contexts/authContext";

export default function App() {
    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold
    })

  return (
    <NativeBaseProvider theme={THEME}>
        <StatusBar
            translucent={true}
            backgroundColor={`#202024`}
            barStyle={`light-content`}
        />

        <AuthContextProvider>
            {fontsLoaded ? <Routes/> : <Loading/>}
        </AuthContextProvider>

    </NativeBaseProvider>
  );
}

