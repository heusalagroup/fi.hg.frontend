// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { FormFieldState } from "../../types/FormFieldState";
import { useFieldChangeState } from "./useFieldChangeState";
import { LogService } from "../../../core/LogService";
import { useFieldIdentifier } from "./useFieldIdentifier";
import { FieldChangeCallback } from "./useFieldChangeCallback";
import { useFieldFileChangeEventCallback } from "./array/useFieldFileChangeEventCallback";
import { parseJson } from "../../../core/Json";
import { FileService } from "../../../../../services/FileService";
import { ProcureFile } from "../../../../../app/procurenode/types/ProcureFile";

const LOG = LogService.createLogger('useFileInputField');

type InternalValueType = string;

export function useFileInputField(
    label: string,
    key: string,
    change: FieldChangeCallback<string | undefined> | undefined,
    changeState: FieldChangeCallback<FormFieldState> | undefined,
    propsValue: ProcureFile | undefined,
    ticketId: string | undefined,
    workspaceId: string | undefined,
) {

    const identifier = useFieldIdentifier(key, label);  //key: label string pair

    const [fieldState, setFieldState] = useState<FormFieldState>(FormFieldState.CONSTRUCTED);
    const [value, setValue] = useState<ProcureFile | undefined>();
    const [file, setFile] = useState<File[] | undefined>([]);

    const parseAndChangeCallback = useCallback(
        (newValue: string | undefined) => {
            const parsedValue = parseJson(newValue) as string;

            if (change) {
                change(parsedValue);
            }
        },
        [
            change,
            propsValue
        ]
    );

    const onChangeCallback = useFieldFileChangeEventCallback(
        identifier,
        setValue,
        setFile,
        parseAndChangeCallback,
        workspaceId,
        ticketId
    );

    const saveFileCallback = useCallback(
        () => {
            if(value) {
                const client = FileService.saveFile(value)
                console.log('CurrentFileInClient CLIENT', client)
            }
        },
        [

        ]
    )

    useEffect(
        () => {
            saveFileCallback()
        },
        [
            onChangeCallback
        ])

    useFieldChangeState(changeState, fieldState);

    return {
        fieldState,
        value,
        onChangeCallback,
        file
    };

}
