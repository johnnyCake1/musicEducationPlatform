function httpReqAsync(url, reqMethod, jwt, reqBody) {
  const fetchData = {
    headers: {
      "Content-Type": "application/json",
    },
    method: reqMethod,
  };
  if (jwt) {
    fetchData.headers.Authorization = `Bearer ${jwt}`;
  }
  if (reqBody) {
    fetchData.body = JSON.stringify(reqBody);
  }

  return fetch(url, fetchData).then((res) => {
    if (res.status === 200) return res.json();
  });
}

export default httpReqAsync;
