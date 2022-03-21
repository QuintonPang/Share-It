export const fetchUser = () => {
    return localStorage.getItem("user") !== 'undefined'?JSON.parse(localStorage.getItem("user")) : localStorage.clear() // clear when something went wrong like user token expired
}
