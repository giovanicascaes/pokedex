export async function fetchAsJson<T>(url: string) {
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then<T>((res) => {
    if (!res.ok) {
      throw { status: res.status, message: `Error fetching from ${url}` };
    }

    return res.json();
  });
}
