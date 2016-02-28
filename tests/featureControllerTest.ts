/// <reference path='../typings/tsd.d.ts' />
/// <reference path='helpers.ts' />
/// <reference path='../app/app.ts' />

describe('feature Controller Test', ()=> {
    "use strict";

    var mockScope :any= {};
    var controller: flip.FeaturesController;
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
        mockLog = $log;
        mockScope = $rootScope.$new();
        $cookies = _$cookies_;
        controller = $controller('featuresController', {
            $http: $http,
            $cookies: $cookies,
            $log: mockLog
        });
        backend.flush();
        helpers.clearAllCookies(_$cookies_);
    }));
    
    it('contains needed definitions', () => {
        expect(controller.strategies.length > 0).toBe(true);
        expect(controller.definitions).toEqual(definitions());
    });

    describe('feature flags', ()=> {
        beforeEach(()=>{
            this.first_def = controller.definitions[0];
            this.second_def = controller.definitions[1];

            // since we have only implemented cookies right now
            $cookies.putObject(`flip_${this.first_def.name}`, true);
            $cookies.putObject(`flip_${this.second_def.name}`, false);
            $cookies.remove('flip_other');
        });

        it('can determine if switch is set', () => {
            expect(controller.status(this.first_def.name)).toBe(true);
            expect(controller.status(this.second_def.name)).toBe(false);
        });

        it('should return false if the flag does not exist', () => {
            expect(controller.status('other')).toBe(false);
        });

        it('status flag, status text and toggle text should return something', () => {
            expect(controller.statusFlag('shiny_things')).not.toBeUndefined();
            expect(controller.statusText('shiny_things')).not.toBeUndefined();
            expect(controller.toggleText(controller.strategies[0], 'shiny_things')).not.toBeUndefined();
        });
    });

    describe('can flip the switch', () => {
        beforeEach(() => {
            this.first_def = controller.definitions[0];
            this.before_flip = controller.status(this.first_def.name);
            mockScope.$apply(() => { 
                controller.toggle(controller.strategies[0], this.first_def);
            });
        });
        it('will be flipped', () => {
            let expected = !this.before_flip;
            expect(controller.status(this.first_def.name)).toBe(expected);
            // cookie here is another cookie library, not ng
            expect(cookie.get(`flip_${this.first_def.name}`)).toBe(expected.toString());
            expect($cookies.get(`flip_${this.first_def.name}`)).toBe(expected.toString());
        });
    });

});