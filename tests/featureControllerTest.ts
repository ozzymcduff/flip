/// <reference path='../typings/tsd.d.ts' />
/// <reference path='helpers.ts' />
/// <reference path='../app/app.ts' />

describe('feature Controller Test', ()=> {
    "use strict";

    var mockScope :any= {};
    var controller;
    var cookies: ng.cookies.ICookiesService;
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

    beforeEach(angular.mock.inject(($controller, $rootScope, $http, $log, $cookies) => {
        mockScope = $rootScope.$new();
        mockLog = $log;
        cookies = $cookies;
        controller = $controller('featuresController', {
            $scope: mockScope,
            $http: $http,
            $cookies: cookies,
            $log: mockLog
        });
        backend.flush();
    }));
    
    beforeEach(() => {
        let cookieHelper = new helpers.CookieHelper(cookies);
        cookieHelper.clearAll();
    });

    it('contains needed definitions', () => {
        expect(mockScope.strategies.length>0).toBe(true);
        expect(mockScope.definitions).toEqual(definitions());
    });

    describe('feature flags', ()=> {
        beforeEach(()=>{
            // since we have only implemented cookies right now
            cookies.putObject('flip_shiny_things', true);
            cookies.putObject('flip_world_domination', false);
            cookies.remove('flip_other');
        });

        it('can determine if switch is set', () => {
            expect(mockScope.status('shiny_things')).toBe(true);
            expect(mockScope.status('world_domination')).toBe(false);
        });

        it('should return false if the flag does not exist', () => {
            expect(mockScope.status('other')).toBe(false);
        });

        it('can flip the switch', () => {
            let def = mockScope.definitions[0];
            let name = def.name;
            expect(cookie.get(`flip_${name}`)).toBe('true');
            expect(mockScope.status(name)).toBe(true);
            mockScope.toggle(mockScope.strategies[0], def);
            expect(cookie.get(`flip_${name}`)).toBe('false');
            /*setTimeout(() => { 
                expect(mockScope.status(name)).toBe(false);
                done();
            })*/
        });


        it('status flag, status text and toggle text should return something', () => {
            expect(mockScope.statusFlag('shiny_things')).not.toBeUndefined();
            expect(mockScope.statusText('shiny_things')).not.toBeUndefined();
            expect(mockScope.toggleText(mockScope.strategies[0], 'shiny_things')).not.toBeUndefined();
        });

    });

});