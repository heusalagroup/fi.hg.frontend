export const routeValidation = (url:string):boolean => {
    if(url[url.length -1] === '/' ) return false;
    return true
}