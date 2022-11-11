// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ChangeEvent, Dispatch, SetStateAction, useCallback } from "react";
import { FieldChangeCallback, useFieldChangeCallback } from "../useFieldChangeCallback";

/**
 *
 * @param identifier
 * @param setValue
 * @param change
 */
export function useFieldFileChangeEventCallback (
    identifier: string,
    setValue: Dispatch<SetStateAction<string[] | undefined>>,
    setFile:Dispatch<SetStateAction<File[] | undefined>>,
    change: FieldChangeCallback<string | undefined> | undefined
) {
    const changeCallback = useFieldChangeCallback<string | undefined>(identifier, change);
    return useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            if ( event ) {
                event.preventDefault();
                event.stopPropagation();
            }

            const eventTargetValue = event?.target?.files;

            if(eventTargetValue?.item(0) !== null && eventTargetValue) {
                setFile((prev:any) => [...prev, eventTargetValue?.item(0)]);
                const files = []
                files.push(eventTargetValue)
                const newObj = files?.map((item: any) => {
                    return {
                        'lastModified'     : item[0]?.lastModified,
                        'lastModifiedDate' : item[0]?.lastModifiedDate,
                        'name'             : item[0]?.name,
                        'size'             : item[0]?.size,
                        'type'             : item[0]?.type
                    };
                })
                const stringified = JSON.stringify(newObj)
                setValue((prev:any) => [...prev, stringified]);
                changeCallback(JSON.stringify(eventTargetValue));
            }
        },
        [
            changeCallback,
            setValue,
            setFile
        ]
    );
}
