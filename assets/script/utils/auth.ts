const Auth_KEY = '__auth__uid__';

export function getAuth() {
    const auth = localStorage.getItem(Auth_KEY);
    if (auth) 
    {
        return auth
    };

    const uid = Math.random().toString(36).slice(2);
    setAuth(uid);

    return uid;
}

export function setAuth(auth: string) {
    return localStorage.setItem(Auth_KEY, auth);
}
