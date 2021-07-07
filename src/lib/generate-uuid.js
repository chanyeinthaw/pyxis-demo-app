export const generateUniqueId = () => {
    const genPart = (len) => Math.random().toString(16).substr(2, len)

    return (Math.trunc((Math.random() * 10e4)) + '').split(``).map(l => genPart(+l)).join('-')
}