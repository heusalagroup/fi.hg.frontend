// Copyright (c) 2021-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { trim } from "../../core/functions/trim";
import { isString } from "../../core/types/String";

export enum StyleScheme {
    FLAT        = 0,
    NEUMORPHISM = 1
}

/**
 * Also available `StyleScheme.test(value) : boolean`
 * @param value
 */
export function isStyleScheme (value: any): value is StyleScheme {
    switch (value) {

        case StyleScheme.FLAT:
        case StyleScheme.NEUMORPHISM:
            return true;

        default:
            return false;
    }
}

/**
 * Also available `StyleScheme.parse(value: any) : StyleScheme | undefined`
 * @param value
 */
export function parseStyleScheme (value: any): StyleScheme | undefined {

    if (isStyleScheme(value)) return value;

    if (isString(value)) {
        value = trim(value).toUpperCase();
        switch (value) {

            case '0':
            case 'FLAT'  : return StyleScheme.FLAT;

            case '1':
            case 'NEUMORPHISM' : return StyleScheme.NEUMORPHISM;

            default      : return undefined;
        }
    }

    return undefined;

}

/**
 * Also available `StyleScheme.stringify(value: StyleScheme | undefined) : string`
 *
 * @param value
 */
export function stringifyStyleScheme (value: StyleScheme | undefined): string {
    if (value === undefined) return 'undefined';
    switch (value) {
        case StyleScheme.FLAT        : return 'FLAT';
        case StyleScheme.NEUMORPHISM : return 'NEUMORPHISM';
        default                      : return `StyleScheme(${value})`;
    }
}
