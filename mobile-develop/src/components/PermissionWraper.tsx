import React, {memo, ReactElement, useEffect, useMemo} from 'react';
import styled from 'styled-components/native';
import {
  Platform,
  Rationale,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import {check, openSettings, request} from 'react-native-permissions';
import {Permission} from 'react-native-permissions/src/types';
import MessageView from './MessageView';
import useAsyncFn from 'react-use/lib/useAsyncFn';

const _MessageView = styled(MessageView)`
  width: 100%;
  height: 100%;
`;

type PermissionWrapperProps = {
  permission: Permission;
  rationale?: Rationale;
  children?: ReactElement | ReactElement[];
  autoAsk?: boolean;
} & Partial<ViewProps>;

let awaitingPromise: Promise<any> | undefined = undefined;

export const PermissionWrapper = memo(function PermissionWrapper({
  permission,
  rationale,
  children,
  autoAsk = true,
  ...props
}: PermissionWrapperProps) {
  const [{value: status}, startChecking] = useAsyncFn(async () => {
    if (!permission.startsWith(Platform.OS)) return;

    if (autoAsk) {
      // if another permission is waiting to response, then wait.
      // this prevent from multiple asking at the same time, the only first one is asked
      if (awaitingPromise) await awaitingPromise;
      awaitingPromise = request(permission, rationale);
      return await awaitingPromise;
    }
    return await check(permission);
  }, [permission, rationale, autoAsk]);

  useEffect(() => {
    startChecking();
  }, [startChecking]);

  const Status = useMemo(() => {
    if (status === 'granted' || !permission?.startsWith(Platform.OS)) {
      return children;
    }

    if (!status) {
      return (
        <TouchableOpacity onPress={startChecking}>
          <_MessageView title={'Permission Required'} />
        </TouchableOpacity>
      );
    }

    if (status === 'blocked') {
      return (
        <TouchableOpacity onPress={openSettings}>
          <_MessageView
            title={'Permission Blocked'}
            description={'Please press here to open Setting'}
          />
        </TouchableOpacity>
      );
    }

    if (status === 'denied') {
      return (
        <TouchableOpacity onPress={startChecking}>
          <_MessageView
            title={'Permission Denied'}
            description={'Please press here to grant permission'}
          />
        </TouchableOpacity>
      );
    }

    if (status === 'unavailable') {
      return (
        <_MessageView
          title={'Permission Unavailable'}
          description={'Your device can not use this feature'}
        />
      );
    }

    return children;
  }, [status, children, permission, startChecking]);

  return <View {...props}>{Status}</View>;
});
