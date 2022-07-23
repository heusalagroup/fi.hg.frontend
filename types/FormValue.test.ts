// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { FormValue,  isFormValue, parseFormValue, stringifyFormValue } from "./FormValue";

describe('isFormValue', () => {

    test( 'can detect FormValues', () => {

        expect(isFormValue({})).toBe(true);
        expect(isFormValue({"foo":"bar"})).toBe(true);
        expect(isFormValue({"foo":123})).toBe(true);
        expect(isFormValue({"foo":null})).toBe(true);
        expect(isFormValue({"foo":undefined})).toBe(true);
        expect(isFormValue({"foo":[1, 2, 3]})).toBe(true);
        expect(isFormValue({"foo":["1", "2", "3"]})).toBe(true);
        expect(isFormValue({"foo":[1, "2", 3]})).toBe(true);
        expect(isFormValue({
            "foo": {
            "hello": "world"
        }
        })).toBe(true);

    });

    test( 'can detect invalid values', () => {

        expect( isFormValue(undefined) ).toBe(false);
        expect( isFormValue(null) ).toBe(false);
        expect( isFormValue(false) ).toBe(false);
        expect( isFormValue(true) ).toBe(false);
        expect( isFormValue(NaN) ).toBe(false);
        expect( isFormValue(() => {}) ).toBe(false);
        expect( isFormValue(0) ).toBe(false);
        expect( isFormValue(Symbol()) ).toBe(false);
        expect( isFormValue(1628078651664) ).toBe(false);
        expect( isFormValue(new Date('2021-08-04T12:04:00.844Z')) ).toBe(false);
        expect( isFormValue(1) ).toBe(false);
        expect( isFormValue(12) ).toBe(false);
        expect( isFormValue(-12) ).toBe(false);
        expect( isFormValue(123) ).toBe(false);
        expect( isFormValue(123.99999) ).toBe(false);
        expect( isFormValue(-123.99999) ).toBe(false);
        expect( isFormValue("123") ).toBe(false);
        expect( isFormValue("hello") ).toBe(false);
        expect( isFormValue("") ).toBe(false);
        expect( isFormValue([]) ).toBe(false);
        expect( isFormValue([123]) ).toBe(false);
        expect( isFormValue(["123"]) ).toBe(false);
        expect( isFormValue(["Hello world", "foo"]) ).toBe(false);

    });

});

describe('stringifyFormValue', () => {

    test( 'can stringify values', () => {

        expect(stringifyFormValue({})).toBe(`FormValue(${JSON.stringify({})})`);
        expect(stringifyFormValue({"foo":"bar"})).toBe(`FormValue(${JSON.stringify({"foo":"bar"})})`);
        expect(stringifyFormValue({"foo":123})).toBe(`FormValue(${JSON.stringify({"foo":123})})`);
        expect(stringifyFormValue({"foo":null})).toBe(`FormValue(${JSON.stringify({"foo":null})})`);
        expect(stringifyFormValue({"foo":undefined})).toBe(`FormValue(${JSON.stringify({"foo":undefined})})`);
        expect(stringifyFormValue({"foo":[1, 2, 3]})).toBe(`FormValue(${JSON.stringify({"foo":[1, 2, 3]})})`);
        expect(stringifyFormValue({"foo":["1", "2", "3"]})).toBe(`FormValue(${JSON.stringify({"foo":["1", "2", "3"]})})`);
        expect(stringifyFormValue({"foo":[1, "2", 3]})).toBe(`FormValue(${JSON.stringify({"foo":[1, "2", 3]})})`);
        expect(stringifyFormValue({"foo": {"hello": "world"}})).toBe(`FormValue(${JSON.stringify({"foo": {"hello": "world"}})})`);

    });

    test( 'throws TypeError on incorrect values', () => {

        // @ts-ignore
        expect( () => stringifyFormValue(undefined) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(null) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(false) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(true) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(NaN) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(() => {}) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(0) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(Symbol()) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(1628078651664) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(new Date('2021-08-04T12:04:00.844Z')) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(1) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(12) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(-12) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(123) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(123.99999) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(-123.99999) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue("123") ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue("hello") ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue("") ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue([]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue([123]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(["123"]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyFormValue(["Hello world", "foo"]) ).toThrow(TypeError);

    });

});

describe('parseFormValue', () => {

    test( 'can parse FormValues', () => {

        expect(parseFormValue({})).toStrictEqual({});
        expect(parseFormValue({"foo":"bar"})).toStrictEqual({"foo":"bar"});
        expect(parseFormValue({"foo":123})).toStrictEqual({"foo":123});
        expect(parseFormValue({"foo":null})).toStrictEqual({"foo":null});
        expect(parseFormValue({"foo":undefined})).toStrictEqual({"foo":undefined});
        expect(parseFormValue({"foo":[1, 2, 3]})).toStrictEqual({"foo":[1, 2, 3]});
        expect(parseFormValue({"foo":["1", "2", "3"]})).toStrictEqual({"foo":["1", "2", "3"]});
        expect(parseFormValue({"foo":[1, "2", 3]})).toStrictEqual({"foo":[1, "2", 3]});
        expect(parseFormValue({"foo": {"hello": "world"}})).toStrictEqual({"foo": {"hello": "world"}});

    });

    test( 'returns undefined for invalid values', () => {

        expect( parseFormValue(undefined) ).toBeUndefined();
        expect( parseFormValue(null) ).toBeUndefined();
        expect( parseFormValue(false) ).toBeUndefined();
        expect( parseFormValue(true) ).toBeUndefined();
        expect( parseFormValue(NaN) ).toBeUndefined();
        expect( parseFormValue(() => {}) ).toBeUndefined();
        expect( parseFormValue(0) ).toBeUndefined();
        expect( parseFormValue(Symbol()) ).toBeUndefined();
        expect( parseFormValue(1628078651664) ).toBeUndefined();
        expect( parseFormValue(new Date('2021-08-04T12:04:00.844Z')) ).toBeUndefined();
        expect( parseFormValue(1) ).toBeUndefined();
        expect( parseFormValue(12) ).toBeUndefined();
        expect( parseFormValue(-12) ).toBeUndefined();
        expect( parseFormValue(123) ).toBeUndefined();
        expect( parseFormValue(123.99999) ).toBeUndefined();
        expect( parseFormValue(-123.99999) ).toBeUndefined();
        expect( parseFormValue("123") ).toBeUndefined();
        expect( parseFormValue("hello") ).toBeUndefined();
        expect( parseFormValue("") ).toBeUndefined();
        expect( parseFormValue([]) ).toBeUndefined();
        expect( parseFormValue([123]) ).toBeUndefined();
        expect( parseFormValue(["123"]) ).toBeUndefined();
        expect( parseFormValue(["Hello world", "foo"]) ).toBeUndefined();

    });

});

describe('FormValue', () => {

    describe('.test', () => {

        test( 'can detect FormValues', () => {

            expect(FormValue.test({})).toBe(true);
            expect(FormValue.test({"foo":"bar"})).toBe(true);
            expect(FormValue.test({"foo":123})).toBe(true);
            expect(FormValue.test({"foo":null})).toBe(true);
            expect(FormValue.test({"foo":undefined})).toBe(true);
            expect(FormValue.test({"foo":[1, 2, 3]})).toBe(true);
            expect(FormValue.test({"foo":["1", "2", "3"]})).toBe(true);
            expect(FormValue.test({"foo":[1, "2", 3]})).toBe(true);
            expect(FormValue.test({
                "foo": {
                    "hello": "world"
                }
            })).toBe(true);

        });

        test( 'can detect invalid values', () => {

            expect( FormValue.test(undefined) ).toBe(false);
            expect( FormValue.test(null) ).toBe(false);
            expect( FormValue.test(false) ).toBe(false);
            expect( FormValue.test(true) ).toBe(false);
            expect( FormValue.test(NaN) ).toBe(false);
            expect( FormValue.test(() => {}) ).toBe(false);
            expect( FormValue.test(0) ).toBe(false);
            expect( FormValue.test(Symbol()) ).toBe(false);
            expect( FormValue.test(1628078651664) ).toBe(false);
            expect( FormValue.test(new Date('2021-08-04T12:04:00.844Z')) ).toBe(false);
            expect( FormValue.test(1) ).toBe(false);
            expect( FormValue.test(12) ).toBe(false);
            expect( FormValue.test(-12) ).toBe(false);
            expect( FormValue.test(123) ).toBe(false);
            expect( FormValue.test(123.99999) ).toBe(false);
            expect( FormValue.test(-123.99999) ).toBe(false);
            expect( FormValue.test("123") ).toBe(false);
            expect( FormValue.test("hello") ).toBe(false);
            expect( FormValue.test("") ).toBe(false);
            expect( FormValue.test([]) ).toBe(false);
            expect( FormValue.test([123]) ).toBe(false);
            expect( FormValue.test(["123"]) ).toBe(false);
            expect( FormValue.test(["Hello world", "foo"]) ).toBe(false);

        });

    });

    describe('.stringify', () => {

        test( 'can stringify values', () => {

            expect(stringifyFormValue({})).toBe(`FormValue(${JSON.stringify({})})`);
            expect(stringifyFormValue({"foo":"bar"})).toBe(`FormValue(${JSON.stringify({"foo":"bar"})})`);
            expect(stringifyFormValue({"foo":123})).toBe(`FormValue(${JSON.stringify({"foo":123})})`);
            expect(stringifyFormValue({"foo":null})).toBe(`FormValue(${JSON.stringify({"foo":null})})`);
            expect(stringifyFormValue({"foo":undefined})).toBe(`FormValue(${JSON.stringify({"foo":undefined})})`);
            expect(stringifyFormValue({"foo":[1, 2, 3]})).toBe(`FormValue(${JSON.stringify({"foo":[1, 2, 3]})})`);
            expect(stringifyFormValue({"foo":["1", "2", "3"]})).toBe(`FormValue(${JSON.stringify({"foo":["1", "2", "3"]})})`);
            expect(stringifyFormValue({"foo":[1, "2", 3]})).toBe(`FormValue(${JSON.stringify({"foo":[1, "2", 3]})})`);
            expect(stringifyFormValue({"foo": {"hello": "world"}})).toBe(`FormValue(${JSON.stringify({"foo": {"hello": "world"}})})`);

        });

        test( 'throws TypeError on incorrect values', () => {

            // @ts-ignore
            expect( () => FormValue.stringify(undefined) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(null) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(false) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(true) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(NaN) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(() => {}) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(0) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(Symbol()) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(1628078651664) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(new Date('2021-08-04T12:04:00.844Z')) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(1) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(12) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(-12) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(123) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(123.99999) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(-123.99999) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify("123") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify("hello") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify("") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify([]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify([123]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(["123"]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => FormValue.stringify(["Hello world", "foo"]) ).toThrow(TypeError);

        });

    });

    describe('.parse', () => {

        test( 'can parse FormValues', () => {

            expect(FormValue.parse({})).toStrictEqual({});
            expect(FormValue.parse({"foo":"bar"})).toStrictEqual({"foo":"bar"});
            expect(FormValue.parse({"foo":123})).toStrictEqual({"foo":123});
            expect(FormValue.parse({"foo":null})).toStrictEqual({"foo":null});
            expect(FormValue.parse({"foo":undefined})).toStrictEqual({"foo":undefined});
            expect(FormValue.parse({"foo":[1, 2, 3]})).toStrictEqual({"foo":[1, 2, 3]});
            expect(FormValue.parse({"foo":["1", "2", "3"]})).toStrictEqual({"foo":["1", "2", "3"]});
            expect(FormValue.parse({"foo":[1, "2", 3]})).toStrictEqual({"foo":[1, "2", 3]});
            expect(FormValue.parse({"foo": {"hello": "world"}})).toStrictEqual({"foo": {"hello": "world"}});

        });

        test( 'returns undefined for invalid values', () => {

            expect( FormValue.parse(undefined) ).toBeUndefined();
            expect( FormValue.parse(null) ).toBeUndefined();
            expect( FormValue.parse(false) ).toBeUndefined();
            expect( FormValue.parse(true) ).toBeUndefined();
            expect( FormValue.parse(NaN) ).toBeUndefined();
            expect( FormValue.parse(0) ).toBeUndefined();
            expect( FormValue.parse(Symbol()) ).toBeUndefined();
            expect( FormValue.parse(1628078651664) ).toBeUndefined();
            expect( FormValue.parse(new Date('2021-08-04T12:04:00.844Z')) ).toBeUndefined();
            expect( FormValue.parse(1) ).toBeUndefined();
            expect( FormValue.parse(12) ).toBeUndefined();
            expect( FormValue.parse(-12) ).toBeUndefined();
            expect( FormValue.parse(123) ).toBeUndefined();
            expect( FormValue.parse(123.99999) ).toBeUndefined();
            expect( FormValue.parse(-123.99999) ).toBeUndefined();
            expect( FormValue.parse("123") ).toBeUndefined();
            expect( FormValue.parse("hello") ).toBeUndefined();
            expect( FormValue.parse("") ).toBeUndefined();
            expect( FormValue.parse([]) ).toBeUndefined();
            expect( FormValue.parse([123]) ).toBeUndefined();
            expect( FormValue.parse(["123"]) ).toBeUndefined();
            expect( FormValue.parse(["Hello world", "foo"]) ).toBeUndefined();

        });

    });

});
