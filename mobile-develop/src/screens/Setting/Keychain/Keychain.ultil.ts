export const isNodeAccount = (name: string, devices: any[]) => {
  return devices.find(device => device.IsPNode && device.AccountName === name);
};
