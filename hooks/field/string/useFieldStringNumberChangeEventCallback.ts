// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ChangeEvent, Dispatch, SetStateAction, useCallback } from "react";
import { FieldChangeCallback, useFieldChangeCallback } from "../useFieldChangeCallback";

/**
 *
 * @param identifier
 * @param setValue
 * @param change
 */
export function useFieldStringNumberChangeEventCallback (
    identifier: string,
    setValue: Dispatch<SetStateAction<string>>,
    change: FieldChangeCallback<string | undefined> | undefined
) {
    const changeCallback = useFieldChangeCallback<string>(identifier, change);
    return useCallback(
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if ( event ) {
                event.preventDefault();
                event.stopPropagation();
            }
            const eventTargetValue = (
                (event?.target?.value ?? '')
                .replace(',', '.')
                .replace(/ +/g, '')
            );
            setValue(eventTargetValue);
            changeCallback(eventTargetValue);
        },
        [
            changeCallback,
            setValue
        ]
    );
}

// const onChangeHandler = (event: any) => {
//
//     let validInput = eventVal.replace(/\s\[A-Za-z]/g, '');
//     let regexValidation = /^\d+\.?(?:\d{1,2})?$/; // change decimal digit count here
//
//     if ( !isNaN(validInput) && !isNaN(parseFloat(validInput)) ) {
//         setDecimalValue(validInput);
//     } else {
//         setDecimalValue(eventVal);
//     }
//
//     if ( isNaN(parseFloat(eventVal)) && eventVal.length > 0 ) {
//         setIsValid(false);
//     } else if ( regexValidation.test(eventVal) || eventVal.length <= 1 ) {
//         setIsValid(true);
//     } else {
//         setIsValid(false);
//     }
//
//     onChangeCallback(event); // Only changes value if integer
//
//     toNumber(decimalValue); // returns false if decimal
// };


