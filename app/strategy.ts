/// <reference path='../typings/tsd.d.ts' />
module flip.strategy {
    "use strict";

    export interface IStrategy {
        name: string;
        description: string;
        knows(d: string): boolean;
        on(d: string): boolean;
        flip(d: string, v?: boolean): void;
        remove(definition: string): void;
    }

    export class CookieStrategy implements IStrategy {
        private cookies: ng.cookies.ICookiesService;
        private domain: string;
        constructor($cookies: ng.cookies.ICookiesService, domain: string) {
            this.cookies = $cookies;
            this.domain = domain;
        }
        get name() {
            return 'cookie';
        }
        get description() {
            return 'Uses cookies to apply only to your session.';
        }
        knows(definition: string) {
            return this.cookies.get(this.cookieName(definition)) !== undefined;
        }
        cookieName(definition: string) {
            return `flip_${definition}`;
        }
        on(definition: string) {
            return this.cookies.get(this.cookieName(definition)) === 'true';
        }
        flip(key: string, on?: boolean) {
            if (on === undefined) {
                on = !this.on(key);
            }
            return this.cookies.put(this.cookieName(key), on ? 'true' : 'false', { domain: this.domain });
        }
        remove(definition: string) {
            this.cookies.remove(this.cookieName(definition), { domain: this.domain });
        }
    }

}