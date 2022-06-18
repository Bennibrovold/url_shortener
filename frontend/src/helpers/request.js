const host = 'http://109.110.36.64/';

const request = (url, type, data = null) => {

    const headers = {
        method: type,
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true,
        body: data != null ? JSON.stringify(data) : data
    };

    return fetch(host + url, headers)
        .then((data) => data.text())
        .then((data) => JSON.parse(data))
        .catch((e) => console.log(e));
}

export { 
    request,
    host
}