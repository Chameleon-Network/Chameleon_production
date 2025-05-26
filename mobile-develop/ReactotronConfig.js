import Reactotron, { networking } from "reactotron-react-native";

import AsyncStorage from "@react-native-community/async-storage";
import { reactotronRedux } from 'reactotron-redux'

Reactotron.clear()

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({
        name: "React Native Demo",
    })
    .use(reactotronRedux(), networking())
    .useReactNative({
        editor: false, // there are more options to editor
        errors: { veto: (stackFrame) => false }, // or turn it off with false
        overlay: false, // just turning off overlay
    })
    .connect();

export default reactotron // also: export me so I can be referenced by Redux store
