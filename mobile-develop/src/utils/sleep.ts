export async function sleep(seconds: number) {
  let _timeout: any = undefined;

  await new Promise(resolve => {
    _timeout = setTimeout(() => {
      resolve(true);
    }, seconds * 1000);
  });
  _timeout && clearTimeout(_timeout);
  return;
} 