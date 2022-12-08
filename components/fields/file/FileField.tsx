// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {ReactNode, useState} from 'react';
import { EmailFieldModel } from "../../../types/items/EmailFieldModel";
import { FormFieldState, stringifyFormFieldState } from "../../../types/FormFieldState";
import { ThemeService } from "../../../services/ThemeService";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import { EMAIL_FIELD_CLASS_NAME, FIELD_CLASS_NAME } from "../../../constants/hgClassName";
import { useStringField } from "../../../hooks/field/useStringField";
import { FieldChangeCallback } from "../../../hooks/field/useFieldChangeCallback";
import './FileField.scss';
import {useSupplierSelectFieldItemList} from "../../../../../../hooks/supplier/useSupplierSelectFieldItemList";
import {useSelectField} from "../../../hooks/field/useSelectField";
import {SelectTemplate} from "../select/SelectTemplate";
import {SupplierFieldProps} from "../../../../../../components/fields/supplierField/SupplierField";
import {useFileField} from "../../../hooks/field/useFileField";

const COMPONENT_CLASS_NAME = EMAIL_FIELD_CLASS_NAME;
const COMPONENT_INPUT_TYPE = "file";

export interface FileFieldProps {
    readonly className   ?: string;
    readonly style       ?: StyleScheme;
    readonly label       ?: string;
    readonly placeholder ?: string;
    readonly model       ?: EmailFieldModel;
    readonly value       ?: File;
    readonly change      ?: FieldChangeCallback<string | undefined>;
    readonly changeState ?: FieldChangeCallback<FormFieldState>;
    readonly children    ?: ReactNode;
}

export function FileField (props: FileFieldProps) {

    const className = props?.className;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const placeholder = props.placeholder ?? props.model?.placeholder;
    const label = props.label ?? props.model?.label ?? '';

    const {
        fieldState,
        onFocusCallback,
        onChangeCallback,
        files,
        setFiles
    } = useFileField<any>(
        label,
        props?.model?.key ?? '',
        props?.change,
        props?.changeState,
        true,
        props?.value,

    );

    return (
       <div>
           <div>
               <label>Pick a file</label>
               <input type="file" id="file" name="file" onChange={(item) => setFiles((prev:any) => [...prev, item] )} />
           </div>
           {files.toString()}
           {props.children}
       </div>

    );

}
