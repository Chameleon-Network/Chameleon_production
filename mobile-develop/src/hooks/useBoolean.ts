import {useMemo} from 'react';
import useToggle from './useToggle';

/**
 * Return array of [value, setTrue, setFalse], you can call setTrue and setFalse without setup useCallback
 */
const useBoolean = (
  initialValue: boolean = false,
): [boolean, () => void, () => void, () => void] => {
  const [value, toggle] = useToggle(initialValue);

  const {setTrue, setFalse, setToggle} = useMemo(
    () => ({
      setTrue: () => toggle(true),
      setFalse: () => toggle(false),
      setToggle: () => toggle(!value),
    }),
    [value],
  );

  return [value, setTrue, setFalse, setToggle];
};

export default useBoolean;
