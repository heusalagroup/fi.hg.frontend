// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    ReactNode,
    useCallback
} from "react";
import { VoidCallback } from "../../../core/interfaces/callbacks";
import { Button } from "../button/Button";
import { LogService } from "../../../core/LogService";
import { FORM_CONTROLS_CLASS_NAME } from "../../constants/hgClassName";
import { TranslationFunction } from "../../../core/types/TranslationFunction";
import "./FormControls.scss";

const LOG = LogService.createLogger('FormControls');

export interface FormControlsProps {
    readonly t : TranslationFunction;
    readonly hasErrors?: boolean;
    readonly className?: string;
    readonly cancelLabel?: string;
    readonly cancel?: VoidCallback;
    readonly submitLabel?: string;
    readonly submit?: VoidCallback;
    readonly children ?: ReactNode;
}

export function FormControls (props: FormControlsProps) {

    const t = props?.t;
    const className = props?.className;
    const propsSubmit = props?.submit;
    const propsCancel = props?.cancel;
    const hasErrors: boolean = !!props?.hasErrors;
    const submitLabel: string = props?.submitLabel ?? 'common.submitLabel';
    const cancelLabel: string = props?.cancelLabel ?? 'common.cancelLabel';

    const hasSubmit: boolean = !!propsSubmit
    const hasCancel: boolean = !!propsCancel;

    const onCancelCallback = useCallback(
        () => {
            try {
                if ( propsCancel ) {
                    propsCancel();
                } else {
                    LOG.error(`onCancel: No cancel prop defined`);
                }
            } catch (err) {
                LOG.error(`onCancel: Error: `, err);
            }
        },
        [

        ]
    );

    const onSubmitCallback = useCallback(
        () => {
            try {
                if ( propsSubmit ) {
                    propsSubmit();
                } else {
                    LOG.error(`onSubmit: No submit prop defined`);
                }
            } catch (err) {
                LOG.error(`onSubmit: Error: `, err);
            }
        },
        [
            propsSubmit
        ]
    );

    return (
        <div
            className={
                FORM_CONTROLS_CLASS_NAME
                + (className ? ` ${className}` : '')
                + (hasErrors ? ` ${FORM_CONTROLS_CLASS_NAME}-with-errors` : '')
            }
        >

            <div className={FORM_CONTROLS_CLASS_NAME + '-content'}>{props?.children}</div>

            {hasCancel ? (
                <Button
                    className={
                        FORM_CONTROLS_CLASS_NAME + '-button '
                        + FORM_CONTROLS_CLASS_NAME + '-cancel-button'
                    }
                    click={onCancelCallback}
                >{t(cancelLabel)}</Button>
            ) : null}

            {hasSubmit ? (
                <Button
                    className={
                        FORM_CONTROLS_CLASS_NAME + '-button '
                        + FORM_CONTROLS_CLASS_NAME + '-submit-button'
                    }
                    click={onSubmitCallback}
                >{t(submitLabel)}</Button>
            ) : null}

        </div>
    );

}


