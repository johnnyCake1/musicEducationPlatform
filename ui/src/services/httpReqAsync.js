export function httpReqAsync(url, reqMethod, jwt, reqBody) {
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
    if (reqBody instanceof String) {
      fetchData.body = reqBody;
    } else if (reqBody instanceof Object) {
      fetchData.body = JSON.stringify(reqBody);
    }
  }

  return fetch(url, fetchData).then((res) => {
    console.log("this is result:", res);
    if (200 <= res.status && res.status < 300) {
      const contentType = res.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return res.json(); // Parse the response body as JSON
      } else {
        return res.text(); // Get the response body as text
      }
    }
    console.log("bad request!");
  });
}

export function postFile(url, file, jwt) {
  const fetchData = {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    method: "POST",
    body: file,
  };

  return fetch(url, fetchData).then((res) => {
    if (200 <= res.status && res.status < 300) return res;
    console.log("bad request!");
  });
}

// const s = () => {
//   const file = new File();
//   fetch(`storage/messageFile?conversationId=${selectedConversation.id}&userId=${currentUser.id}`, {
//     headers: {
//       Authorization: `Bearer ${jwt}`,
//     },
//     method: "POST",
//     body: file,
//   })
// }

export function getFile(url, jwt, reqBody) {
  const fetchData = {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    method: "GET",
  };
  if (reqBody) {
    fetchData.body = JSON.stringify(reqBody);
  }

  return fetch(url, fetchData).then((res) => {
    if (200 <= res.status && res.status < 300) return res.blob();
    console.log("bad request!");
  });
}
