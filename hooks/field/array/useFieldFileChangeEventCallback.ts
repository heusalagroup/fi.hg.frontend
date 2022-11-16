// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ChangeEvent, Dispatch, SetStateAction, useCallback } from "react";
import { FieldChangeCallback, useFieldChangeCallback } from "../useFieldChangeCallback";
import { ProcureFile } from "../../../../../../app/procurenode/types/ProcureFile";

/**
 *
 * @param identifier
 * @param setValue
 * @param change
 */
export function useFieldFileChangeEventCallback(
    identifier: string,
    setValue: Dispatch<SetStateAction<ProcureFile | undefined>>,
    setFile: Dispatch<SetStateAction<File[] | undefined>>,
    change: FieldChangeCallback<string | undefined> | undefined,
    workspaceId: string | undefined,
    ticketId: string | undefined
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
                        'lastModified': item[0]?.lastModified,
                        'lastModifiedDate': item[0]?.lastModifiedDate,
                        'name': item[0]?.name,
                        'size': item[0]?.size,
                        'type': item[0]?.type
                    };
                })
                if (workspaceId && ticketId) {
                    const testObj = {
                        file: eventTargetValue[0],
                        fileId: 'new',
                        workspaceId: workspaceId,
                        ticketId: ticketId
                    }
                    const stringified = JSON.stringify(newObj)
                    setValue(testObj);
                }
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
