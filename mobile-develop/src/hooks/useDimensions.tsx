import {useCallback, useEffect, useState} from "react";
import {Dimensions} from "react-native";

export enum OrientationEnum {
    LANDSCAPE = 'landscape',
    PORTRAIT = 'portrait'
}

export type useDimensionsOutputType = {
    windowWidth: number,
    windowHeight: number,
    screenWidth: number,
    screenHeight: number,
    orientation: OrientationEnum
}
const useDimensions = () => {
    const getParams = useCallback(() => {
        const {width: windowWidth, height: windowHeight} = Dimensions.get('window');
        const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');
        const orientation: OrientationEnum = windowWidth > windowHeight ? OrientationEnum.LANDSCAPE : OrientationEnum.PORTRAIT;
        return {
            windowWidth,
            windowHeight,
            screenWidth,
            screenHeight,
            orientation
        }
    }, []);

    const [dimensionsState, setDimensionsState] = useState<useDimensionsOutputType>(getParams);

    useEffect(() => {
        const handler = () => {
            setDimensionsState(getParams());
        };

        const event = Dimensions.addEventListener('change', handler);

        return () => {
            event.remove()
        }
    }, []);

    return dimensionsState;
};

export default useDimensions;
