// export function convertSearchParamsToString(
//   searchParams: URLSearchParams,
// ): string {
//   const params = new URLSearchParams(searchParams);
//   const paramsArray = Array.from(params.entries()).map(
//     ([key, value]) => `${key}=${value}`,
//   );
//   return paramsArray.join("&");
// }

export function convertSearchParamsToString(
  searchParams: Record<string, string | string[]>,
) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else {
      params.set(key, value);
    }
  });
  return params.toString();
}
