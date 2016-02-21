/// <reference path='../typings/tsd.d.ts' />
/// <reference path='helpers.ts' />
/// <reference path='../app/app.ts' />

describe('feature Controller Test', ()=> {
    "use strict";

    var mockScope :any= {};
    var controller;
    var $cookies: ng.cookies.ICookiesService;
    var backend;
    var mockLog;
    function definitions(){
        return [{
            name:'shiny_things',
            description:'Shiny things'
        },{
            name:'world_domination',
            description:'World domination'
        }];
    } 

    beforeEach(angular.mock.module('flip'));

    beforeEach(angular.mock.inject(($httpBackend) => {
        backend = $httpBackend;
        backend.expect('GET', 'definitions.json').respond(definitions());
    }));

    beforeEach(angular.mock.inject(($controller, $rootScope, $http, $log, _$cookies_) => {
        mockScope = $rootScope.$new();
        mockLog = $log;
        $cookies = _$cookies_;
        controller = $controller('featuresController', {
            $scope: mockScope,
            $http: $http,
            $cookies: $cookies,
            $log: mockLog
        });
        backend.flush();
        helpers.clearAllCookies(_$cookies_);
    }));
    
    it('contains needed definitions', () => {
        expect(mockScope.strategies.length>0).toBe(true);
        expect(mockScope.definitions).toEqual(definitions());
    });

    describe('feature flags', ()=> {
        beforeEach(()=>{
            this.first_def = mockScope.definitions[0];
            this.second_def = mockScope.definitions[1];

            // since we have only implemented cookies right now
            $cookies.putObject(`flip_${this.first_def.name}`, true);
            $cookies.putObject(`flip_${this.second_def.name}`, false);
            $cookies.remove('flip_other');
        });

        it('can determine if switch is set', () => {
            expect(mockScope.status(this.first_def.name)).toBe(true);
            expect(mockScope.status(this.second_def.name)).toBe(false);
        });

        it('should return false if the flag does not exist', () => {
            expect(mockScope.status('other')).toBe(false);
        });

        it('status flag, status text and toggle text should return something', () => {
            expect(mockScope.statusFlag('shiny_things')).not.toBeUndefined();
            expect(mockScope.statusText('shiny_things')).not.toBeUndefined();
            expect(mockScope.toggleText(mockScope.strategies[0], 'shiny_things')).not.toBeUndefined();
        });
    });

    describe('can flip the switch', () => {
        beforeEach(() => {
            this.first_def = mockScope.definitions[0];
            this.before_flip = mockScope.status(this.first_def.name);
            mockScope.$apply(() => { 
                mockScope.toggle(mockScope.strategies[0], this.first_def);
            });
        });
        it('will be flipped', () => {
            let expected = !this.before_flip;
            expect(mockScope.status(this.first_def.name)).toBe(expected);
            // cookie here is another cookie library, not ng
            expect(cookie.get(`flip_${this.first_def.name}`)).toBe(expected.toString());
            expect($cookies.get(`flip_${this.first_def.name}`)).toBe(expected.toString());
        });
    });

});