/// <reference path='../typings/tsd.d.ts' />
/// <reference path='../app/app.ts' />
/// <reference path='helpers.ts' />

describe('cookie strategy Test', () => {
    var cookies: ng.cookies.ICookiesService;
    var strategy: flip.CookieStrategy; 

    beforeEach(angular.mock.module('flip'));

    beforeEach(() => {
        cookies = new helpers.FakeCookieService();
        strategy = new flip.CookieStrategy(cookies,'localhost');
    });

    describe('cookie interrogration', () => {
        beforeEach(() => {
            strategy.flip('one', true);
            strategy.flip('two', false);
        });
        describe('enabled feature', () => {
            it('#knows is true', () => {
                expect(strategy.knows('one')).toBe(true);
            });
            it('#on is true', () => {
                expect(strategy.on('one')).toBe(true);
            });
        });

        describe('disabled feature', () => {
            it('#knows is true', () => {
                expect(strategy.knows('two')).toBe(true);
            });
            it('#on is false', () => {
                expect(strategy.on('two')).toBe(false);
            });
        });

        describe('feature with no cookie present', () => {
            it('#knows is false', () => {
                expect(strategy.knows('three')).toBe(false);
            });
            it('#on is false', () => {
                expect(strategy.on('three')).toBe(false);
            });
        });

    });

    describe('cookie manipulation', () => {
        beforeEach(() => {
            strategy.flip('c_one', true);
            strategy.flip('c_two', false);
        });
        
        it('can switch known features on', () => {
            strategy.flip('c_two', true);
            expect(strategy.on('c_two')).toBe(true);
            strategy.flip('c_two');
            expect(strategy.on('c_two')).toBe(false);
        });

        it('can switch unknown features on', () => {
            strategy.flip('c_three', true);
            expect(strategy.knows('c_three')).toBe(true);
            strategy.flip('c_four');
            expect(strategy.knows('c_four')).toBe(true);
        });

        it('can switch features off', () => {
            strategy.flip('c_one', false);
            expect(strategy.knows('c_one')).toBe(true);
        });

        xit('can delete knowledge of a feature', () => {
            strategy.remove('c_one');
            expect(strategy.knows('c_one')).toBe(false);
            expect(strategy.on('c_one')).toBe(false);
        });
    });

});