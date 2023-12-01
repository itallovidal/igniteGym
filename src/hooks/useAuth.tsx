import React, {useContext} from 'react';
import {AuthContext} from "@contexts/authContext";

function UseAuth() {
    const contextData = useContext(AuthContext)

    return contextData

}

export default UseAuth;