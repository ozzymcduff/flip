/// <reference path='../typings/tsd.d.ts' />
module helpers {
    "use strict";

    export function clearAllCookies(cookies: ng.cookies.ICookiesService) {
        Object.getOwnPropertyNames(cookies.getAll()).forEach(cookie=> {
            cookies.remove(cookie);
        });
    }

    export class FakeCookieService implements ng.cookies.ICookiesService { 
        _cookies: any;
        constructor() { 
            this._cookies = {};
        }
        get(key: string) { 
            return this._cookies[key];
        }
        getObject(key: string) { 
            return JSON.parse(this._cookies[key]);
        }
        getAll() { 
            return this._cookies;
        }
        put(key: string, value: string, options?: ng.cookies.ICookiesOptions) { 
            this._cookies[key] = value;
        }
        putObject(key: string, value: any, options?: ng.cookies.ICookiesOptions) { 
            this._cookies[key] = JSON.stringify( value);
        }
        remove(key: string, options?: ng.cookies.ICookiesOptions) { 
            delete this._cookies[key];
        }
    }
}