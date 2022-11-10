// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { FormFieldState } from "../../types/FormFieldState";
import { useFieldChangeState } from "./useFieldChangeState";
import { LogService } from "../../../core/LogService";
import { useFieldStringChangeEventCallback } from "./string/useFieldStringChangeEventCallback";
import { useFieldIdentifier } from "./useFieldIdentifier";
import { useFieldMountEffectWithInternalState } from "./useFieldMountEffectWithInternalState";
import { useFieldNumberStateUpdateCallback } from "./number/useFieldNumberStateUpdateCallback";
import { useFieldDecimalNumberInternalValueUpdateCallback } from "./number/useFieldDecimalNumberInternalValueUpdateCallback";
import { useFieldValidateNumberWithStateValueCallback } from "./number/useFieldValidateNumberWithStateValueCallback";
import { useFieldValidateNumberValueCallback } from "./number/useFieldValidateNumberValueCallback";
import { FieldChangeCallback } from "./useFieldChangeCallback";
import { useFieldFileChangeEventCallback } from "./array/useFieldFileChangeEventCallback";

const LOG = LogService.createLogger('useFileInputField');

type InternalValueType = FileList;

export function useFileInputField(
    label: string,
    key: string,
    change: FieldChangeCallback<FileList | null> | undefined,
    changeState: FieldChangeCallback<FormFieldState> | null,
    propsValue: FileList | null,
) {

    const identifier = useFieldIdentifier(key, label);  //key: label string pair

    const [fieldState, setFieldState] = useState<FormFieldState>(FormFieldState.CONSTRUCTED);
    const [value, setValue] = useState<InternalValueType>(propsValue);


    const onChange = (event: React.FormEvent) => {
        const files = (event.target as HTMLInputElement).files

        if (files && files.length > 0) {
            setValue([...value, files[0]])
            LOG.debug('Selected File =', files[0])
        }
    }

    const onChangeCallback = useFieldFileChangeEventCallback(
        identifier,
        setValue,
        onChange
    );

    useFieldChangeState(changeState, fieldState);

    return {
        fieldState,
        value,
        onChangeCallback
    };

}
