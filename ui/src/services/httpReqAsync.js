import { API_URL } from '../constants';

export function httpReqAsync(url, reqMethod, jwt, reqBody) {
  const fetchData = {
    headers: {},
    method: reqMethod,
  };
  if (jwt) {
    fetchData.headers.Authorization = `Bearer ${jwt}`;
  }
  if (reqBody) {
    if (reqBody instanceof Blob) {
      console.log('Sending file');
      const formData = new FormData();
      formData.append('file', reqBody);
      fetchData.body = formData;
    } else if (reqBody instanceof String) {
      fetchData.body = reqBody;
    } else if (reqBody instanceof Object) {
      fetchData.body = JSON.stringify(reqBody);
      fetchData.headers['Content-Type'] = 'application/json';
    }
  }

  return (
    fetch(API_URL + url, fetchData)
      // add res json
      // .then((res) => res.json())
      .then((res) => {
        if (200 <= res.status && res.status < 300) {
          const contentType = res.headers.get('Content-Type');
          if (contentType && contentType.includes('application/json')) {
            return res.json(); // Parse the response body as JSON
          } else {
            return res.text(); // Get the response body as text
          }
        } else {
          return res.json().then((err) => {
            // alert(err.message);
            console.log('Error message:', err.message);
            return Promise.reject(err.message);
          });
          // return Promise.reject('An error occurred while making the request.');
        }
      })
      .catch((error) => {
        return Promise.reject('An error occurred while making the request.');
      })
  );
}
export function getFile(url, jwt, reqBody) {
  const fetchData = {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    method: 'GET',
  };
  if (reqBody) {
    fetchData.body = JSON.stringify(reqBody);
  }

  return fetch(API_URL + url, fetchData).then((res) => {
    if (res.status === 204) return 'file does not exist';
    if (200 <= res.status && res.status < 300) return res.blob();
    console.log('request failed!');
  });
}
