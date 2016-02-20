/// <reference path='../typings/tsd.d.ts' />
module flip {
"use strict";

export interface IStrategy {
    name: string;
    description: string;
    knows(d:string):boolean;
    on(d:string):boolean;
    flip(d:string,v?:boolean):void;
    remove(definition: string): void;
}

class FeaturesController{
    private scope : any;
    constructor($scope: ng.IScope, $http: ng.IHttpService, $log: ng.ILogService, cookieStrategy:IStrategy){
        this.scope = $scope;
        this.scope.strategies = [cookieStrategy];
        this.scope.definitions = [];

        $http.get('definitions.json').success((data:any)=> {
            this.scope.definitions = data;
            $log.log('Loaded definitions');
        });
        this.scope.status = (definition:string)=>{
            let strategies = this.scope.strategies.filter( (strategy:IStrategy) => strategy.knows(definition));
            if (strategies.length>0){
                return strategies[0].on(definition);
            }
            return false;//defaultFor
        };
        this.scope.toggle = (strategy: IStrategy, definition: any) => {
            strategy.flip(definition.name);
        };
        this.scope.toggleText = (strategy: IStrategy, definition: any) => {
            let text = strategy.on(definition.name) ? 'off' : 'on';
            return `Switch ${text}`;
        };

    }
}

export class CookieStrategy implements IStrategy{
    private cookies : ng.cookies.ICookiesService;
    private domain : string;
    constructor($cookies: ng.cookies.ICookiesService, domain:string){
        this.cookies = $cookies;
        this.domain = domain;
    }
    get name(){
        return 'cookie';
    }
    get description(){
        return 'Uses cookies to apply only to your session.';
    }
    knows(definition:string){
        return this.cookies.get(this.cookieName(definition)) !== undefined;
    }
    cookieName(definition:string){
        return `flip_${definition}`;
    }
    on(definition:string){
        return this.cookies.get(this.cookieName(definition)) === 'true';
    }
    flip(key:string,on?:boolean){
        if (on === undefined) { 
            on = ! this.on(key);
        }
        return this.cookies.put(this.cookieName(key), on?'true':'false'); //, {domain: this.domain}
    }
    remove(definition: string) { 
        this.cookies.remove(definition);//, { domain: this.domain }
    }
}

angular.module('flip', ['ngCookies'])
    .controller('featuresController', FeaturesController)
    .constant('domain','localhost')
    .factory('cookieStrategy', function ($cookies: ng.cookies.ICookiesService, domain:string){
        return new CookieStrategy($cookies, domain);
    })
    ;
}