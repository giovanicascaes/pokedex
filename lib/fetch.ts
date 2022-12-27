export async function fetchAsJson<T>(url: string) {
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then<T>((res) => res.json());
}
