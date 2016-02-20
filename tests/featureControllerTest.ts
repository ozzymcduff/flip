/// <reference path='../typings/tsd.d.ts' />
/// <reference path='helpers.ts' />

describe('feature Controller Test', ()=> {
    // Arrange
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
    });

});