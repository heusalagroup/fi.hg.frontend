export function routeValidation(url:string, endpoint:string):boolean {
    if(url[url.length -1] !== '/' && endpoint[0] !== '/') return false;
    if(url[url.length -1] === '/' && endpoint[0] === '/') return false;
    return true;
}