/*global defineSuite*/
defineSuite([
             'DynamicScene/ReferenceProperty',
             'DynamicScene/DynamicObjectCollection',
             'DynamicScene/DynamicObject',
             'Core/JulianDate',
             'Core/TimeInterval',
             'Core/Iso8601'
            ], function(
              ReferenceProperty,
              DynamicObjectCollection,
              DynamicObject,
              JulianDate,
              TimeInterval,
              Iso8601) {
    "use strict";
    /*global jasmine,describe,xdescribe,it,xit,expect,beforeEach,afterEach,beforeAll,afterAll,spyOn,runs,waits,waitsFor*/

    var validTime = JulianDate.fromIso8601('2012');
    var invalidTime = JulianDate.fromIso8601('2014');

    var testPropertyLink = 'testObject.property';
    function createTestObject(dynamicObjectCollection, methodName) {
        var testObject = dynamicObjectCollection.getOrCreateObject('testObject');
        testObject.availability = TimeInterval.fromIso8601('2012/2013');
        testObject.property = {};
        testObject.property[methodName] = function(time, result) {
            result.expectedTime = time;
            result.expectedValue = true;
            return result;
        };
        return testObject;
    }

    it('constructor throws if missing dynamicObjectCollection parameter', function() {
        expect(function() {
            return new ReferenceProperty(undefined, 'object', 'property');
        }).toThrow();
    });

    it('constructor throws if missing targetObjectId parameter', function() {
        expect(function() {
            return new ReferenceProperty(new DynamicObjectCollection(), undefined, 'property');
        }).toThrow();
    });

    it('fromString throws if missing dynamicObjectCollection parameter', function() {
        expect(function() {
            return ReferenceProperty.fromString(undefined, 'object.property');
        }).toThrow();
    });

    it('fromString throws if missing string parameter', function() {
        expect(function() {
            return ReferenceProperty.fromString(new DynamicObjectCollection(), undefined);
        }).toThrow();
    });

    it('getValue returned undefined for unresolved property', function() {
        var property = ReferenceProperty.fromString(new DynamicObjectCollection(), 'object.property');
        expect(property.getValue(new JulianDate())).toBeUndefined();
    });

    it('Resolves target property', function() {
        var dynamicObjectCollection = new DynamicObjectCollection();
        createTestObject(dynamicObjectCollection, 'getValue');
        var property = ReferenceProperty.fromString(dynamicObjectCollection, testPropertyLink);
        var result = {};
        expect(property.getValue(validTime, result)).toEqual(result);
        expect(result.expectedValue).toEqual(true);
        expect(result.expectedTime).toEqual(validTime);
        expect(property.getValue(invalidTime, result)).toBeUndefined();
    });

    it('Resolves target object', function() {
        var dynamicObjectCollection = new DynamicObjectCollection();
        var dynamicObject = new DynamicObject('myId');
        dynamicObjectCollection.add(dynamicObject);
        var property = new ReferenceProperty(dynamicObjectCollection, 'myId');
        expect(property.getValue()).toBe(dynamicObject);
    });
});