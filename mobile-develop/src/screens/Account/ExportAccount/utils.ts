export const parseShard = (bytes) => {
    const arr = bytes.split(',');
    const lastByte = arr[arr.length - 1];
    return (lastByte % 8).toString();
};
