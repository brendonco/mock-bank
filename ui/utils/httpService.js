const baseUrl = "/api/";

async function get(path = null) {
  const response = await fetch(`${baseUrl}${path}`);
  const data = await response.json();
  return data;
}

async function put(path = null, data) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  return responseData;
}

async function post(path = null, data) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  return responseData;
}

export { get, put, post };
