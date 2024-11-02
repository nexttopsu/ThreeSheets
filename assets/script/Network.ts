import { getAuth } from './utils/auth';

let _socket: Socket;


export function connect(ip='http://localhost:9999', query = { auth: getAuth() }) {
    if (!_socket) {
        _socket = io(ip, { query });
    }

    return _socket;
}


export default {
    get socket() {
        return connect();
    }
}
