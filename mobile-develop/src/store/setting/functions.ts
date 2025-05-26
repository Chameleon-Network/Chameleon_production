import LocalDatabase from '@utils/LocalDatabase';
import Device from '@models/device';
import serverService from '@src/services/wallet/Server';
import { actionFetchedDevices, actionFetchedServer } from '.';


export const actionFetchDevices = async () => {
    let devices = [];
    try {
        devices = (await LocalDatabase.getListDevices()).map((device) =>
            Device.getInstance(device),
        );
    } catch (error) {
        console.log('error', error);
    } finally {
        actionFetchedDevices(devices)
    }
};

export const actionFetchServers = async () => {
    let server = null;
    try {
        server = await serverService.getDefault();
    } catch (error) {
        console.log(error);
    } finally {
        actionFetchedServer(server)
    }
};
