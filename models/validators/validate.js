exports.email = (email) => {
    const emailPattern =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email)
    // return String(email).toLowerCase().match(emailPattern)
}

exports.username = (username) => {
    const usernamePattern = /^[a-zA-Z0-9_]{6,12}$/;
    return usernamePattern.test(username)
}

exports.password = (password) => {
    const passwordPattern = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$/;
    return passwordPattern.test(password)
}

// const username = (username) => {
//     const usernamePattern = /^[a-zA-Z0-9_]{6,12}$/;
//     return usernamePattern.test(username)
// }