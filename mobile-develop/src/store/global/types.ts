import {ThemeNameEnum} from "../../types";

export interface GlobalState {
    theme: ThemeNameEnum,
    [key: string]: any
}
