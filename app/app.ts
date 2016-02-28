/// <reference path='../typings/tsd.d.ts' />
/// <reference path='strategy.ts' />
module flip {
"use strict";
    export type IStrategy = flip.strategy.IStrategy;

export class FeaturesController{
    public strategies: [IStrategy];
    public definitions: any;
    constructor($http: ng.IHttpService, $log: ng.ILogService, cookieStrategy:IStrategy){
        this.strategies = [cookieStrategy];
        this.definitions = [];

        $http.get('definitions.json').success((data:any)=> {
            this.definitions = data;
            $log.log('Loaded definitions');
        });
    }

    getStrategy(definition: string): IStrategy {
        let strategies = this.strategies.filter((strategy: IStrategy) => strategy.knows(definition));
        return strategies[0];
    }
    status(definition: string) {
        let s = this.getStrategy(definition);
        if (s !== undefined) {
            return s.on(definition);
        }
        return false;//defaultFor
    }
    toggleText(strategy: IStrategy, definition: any) {
        let text = strategy.on(definition.name) ? 'off' : 'on';
        return `Switch ${text}`;
    }
    toggle(strategy: IStrategy, definition: any) {
        strategy.flip(definition.name);
    }
    statusText(definition: string) {
        return this.status(definition) ? 'Enabled' : 'Disabled';
    }
    statusFlag (definition: string) {
        return this.status(definition) ? 'on' : 'off';
    }
}

angular.module('flip', ['ngCookies'])
    .controller('featuresController', FeaturesController)
    .constant('domain','localhost')
    .service('cookieStrategy', flip.strategy.CookieStrategy);
}