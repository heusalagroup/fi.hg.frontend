// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ChangeEvent, useCallback, useEffect, useState } from "react";
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

type InternalValueType = File;

export function useFileInputField(
    label: string,
    key: string,
    change: FieldChangeCallback<string | undefined> | undefined,
    changeState: FieldChangeCallback<FormFieldState> | undefined,
    propsValue: File | any,
) {

    const identifier = useFieldIdentifier(key, label);  //key: label string pair

    const [fieldState, setFieldState] = useState<FormFieldState>(FormFieldState.CONSTRUCTED);
    const [value, setValue] = useState<InternalValueType[]>([]);


    const onChange = (event: any) => {
        if(propsValue) {
            setValue([propsValue])
        }
    }


    LOG.debug('Selected File 1=', value)

    const onChangeCallback = useFieldFileChangeEventCallback(
        identifier,
        setValue,
        onChange
    );

    useEffect(() => {

    }, [
        onChangeCallback
    ])

    useFieldChangeState(changeState, fieldState);

    return {
        fieldState,
        value,
        onChangeCallback
    };

}
