// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { UserInterfaceClassName } from "../constants/UserInterfaceClassName";
import { FormEvent, useCallback, ReactNode } from "react";
import { LogService } from "../../../core/LogService";

const LOG = LogService.createLogger('Form');

export type SubmitCallback = () => void;

export interface FormProps {
    readonly className ?: string;
    readonly children  ?: ReactNode;
    readonly submit    ?: SubmitCallback;
}

export function Form (props: FormProps) {

    const className = props?.className;
    const submit : SubmitCallback | undefined = props?.submit;

    const submitCallback = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (submit) {
                LOG.debug(`Submit`);
                submit();
            } else {
                LOG.warn(`No submit callback defined`);
            }
        },
        [
            submit
        ]
    );

    return (
        <form
            className={
                UserInterfaceClassName.FORM
                + (className? ` ${className}` : '')
            }
            onSubmit={submitCallback}
        >{props.children}</form>
    );

}
