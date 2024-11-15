export async function pMapSerial<T, U>(
  arr: T[],
  fn: (item: T) => Promise<U>
): Promise<U[]> {
  let overallPromise: Promise<any> = Promise.resolve([]);
  const resArr: U[] = [];

  arr.forEach((element) => {
    overallPromise = overallPromise
      .then(async (i) => fn(element))
      .then((r) => resArr.push(r));
  });

  await overallPromise;
  return resArr;
}
