/// <reference path='../typings/tsd.d.ts' />
/// <reference path='strategy.ts' />
module flip {
"use strict";
    export type IStrategy = flip.strategy.IStrategy;

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
        let getStrategy = (definition: string) : IStrategy=> {
            let strategies = this.scope.strategies.filter((strategy: IStrategy) => strategy.knows(definition));
            return strategies[0];
        };

        this.scope.status = (definition:string)=>{
            let s = getStrategy(definition);
            if (s!==undefined){
                return s.on(definition);
            }
            return false;//defaultFor
        };
        this.scope.statusFlag = (definition: string) => {
            return this.scope.status(definition) ? 'on' : 'off';
        };
        this.scope.statusText = (definition: string) => {
            return this.scope.status(definition) ? 'Enabled' : 'Disabled';
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

angular.module('flip', ['ngCookies'])
    .controller('featuresController', FeaturesController)
    .constant('domain','localhost')
    .factory('cookieStrategy', function ($cookies: ng.cookies.ICookiesService, domain:string){
        return new flip.strategy.CookieStrategy($cookies, domain);
    })
    ;
}