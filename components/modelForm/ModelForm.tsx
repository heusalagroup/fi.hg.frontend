// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { useCallback, useState } from 'react';
import { FormModel } from "../../types/FormModel";
import { FormFieldModel, isFormFieldModel } from "../../types/FormFieldModel";
import { Button } from "../button/Button";
import { FormUtils } from "../fields/FormUtils";
import { filter } from "../../../core/functions/filter";
import { get} from "../../../core/functions/get";
import { map } from "../../../core/functions/map";
import { set } from "../../../core/functions/set";
import { LogService } from "../../../core/LogService";
import { FormItem } from "../../types/FormItem";
import { PageBreakModel } from "../../types/items/PageBreakModel";
import { VoidCallback } from "../../../core/interfaces/callbacks";
import { FormFieldState } from "../../types/FormFieldState";
import { ButtonType } from "../../../core/frontend/button/ButtonType";
import { MODEL_FORM_CLASS_NAME } from "../../constants/hgClassName";
import { FieldChangeCallback } from "../../hooks/field/useFieldChangeCallback";
import { TranslationFunction } from "../../../core/types/TranslationFunction";
import './ModelForm.scss';
import { keys } from "../../../core/functions/keys";
import { every } from "../../../core/functions/every";

const LOG = LogService.createLogger('Form');

export interface ModelFormFieldStateObject {
    readonly [key: string]: FormFieldState;
}

export interface ModelFormProps<ValueT> {
    readonly t          : TranslationFunction;
    readonly className ?: string;
    readonly model: FormModel;
    readonly value: ValueT;
    readonly change?: FieldChangeCallback<ValueT>;
    readonly cancel?: VoidCallback;
    readonly submit?: VoidCallback;
    readonly submitLabel ?: string;
    readonly cancelLabel ?: string;
    readonly backLabel ?: string;
    readonly nextPageLabel ?: string;
    readonly titleLabel ?: string;
}

export function ModelForm (props: ModelFormProps<any>) {

    const t = props?.t;
    const className = props?.className;
    const propsValue = props?.value;
    const propsCancel = props?.cancel;
    const propsSubmit = props?.submit;
    const propsChange = props?.change;
    const defaultSubmitLabel = props?.submitLabel ?? 'fi.hg.modelForm.submitLabel';
    const defaultCancelLabel = props?.cancelLabel ?? 'fi.hg.modelForm.cancelLabel';
    const defaultBackLabel   = props?.backLabel   ?? 'fi.hg.modelForm.backLabel';
    const defaultNextPageLabel   = props?.nextPageLabel   ?? 'fi.hg.modelForm.nextPageLabel';

    const [ page, setPage ] = useState<number>(0);
    const [ fieldStates, setFieldStates ] = useState<ModelFormFieldStateObject>(() => ({}));

    const spec: FormModel = props?.model;
    const mainTitle: string = props?.titleLabel ?? spec.title ?? 'fi.hg.modelForm.mainTitle';
    const allItems: FormItem[] = spec.items;

    const pageCount = FormUtils.getPageCount(allItems);

    if ( page >= pageCount ) {
        LOG.warn(`Warning! Page ${page} is invalid: We only had ${pageCount} pages`);
        return null;
    }

    const pageItems: FormItem[] = pageCount === 1 ? allItems : FormUtils.getPageItems(page, allItems);
    const pageBreak: PageBreakModel | undefined = pageCount === 1 ? undefined : FormUtils.getPageBreak(page, allItems);
    const prevPageBreak: PageBreakModel | undefined = pageCount === 1 || page <= 0 ? undefined : FormUtils.getPageBreak(page - 1, allItems);

    const isFirstPage: boolean = page === 0;
    const isLastPage: boolean = page === pageCount - 1;

    const cancelLabel: string = isFirstPage ? (spec?.cancelLabel ?? defaultCancelLabel) : (prevPageBreak?.backLabel ?? defaultBackLabel);
    const hasCancelProp: boolean = isFirstPage ? !!propsCancel : true;

    const submitLabel: string = isLastPage ? (spec?.submitLabel ?? defaultSubmitLabel) : (pageBreak?.nextLabel ?? defaultNextPageLabel);
    const hasSubmitProp: boolean = isLastPage ? !!propsSubmit : true;

    const fieldState: FormFieldState = getCombinedFieldState(
        fieldStates,
        spec
    );

    const onCancelButtonCallback = useCallback(
        () => {
            try {
                if ( propsCancel ) {
                    propsCancel();
                } else {
                    LOG.warn('No cancel prop defined!');
                }
            } catch (err) {
                LOG.error('Error while executing cancel prop: ' + err);
            }
        },
        [
            propsCancel
        ]
    );

    const onSubmitButtonCallback = useCallback(
        () => {
            try {
                if ( propsSubmit ) {
                    propsSubmit();
                } else {
                    LOG.warn('No submit prop defined!');
                }
            } catch (err) {
                LOG.error('Error while executing submit prop: ' + err);
            }
        },
        [
            propsSubmit
        ]
    );

    const onNextButtonCallback = useCallback(
        () => {
            setPage((currentPage: number) => {
                const pageCount = FormUtils.getPageCount(props?.model?.items);
                const nextPage = currentPage + 1;
                if ( nextPage < pageCount ) {
                    return nextPage;
                } else {
                    return currentPage;
                }
            });
        },
        [
            props?.model?.items,
            setPage
        ]
    );

    const onBackButtonCallback = useCallback(
        () => {
            setPage((currentPage: number) => currentPage - 1 >= 0 ? currentPage - 1 : 0);
        },
        [
            setPage
        ]
    );

    const changeFormValueCallback = useCallback(
        (newValue: any) => {
            try {
                if ( propsChange ) {
                    propsChange(newValue);
                } else {
                    LOG.warn('No change prop defined!');
                }
            } catch (err) {
                LOG.error('Error while executing change prop: ' + err);
            }
        },
        [
            propsChange
        ]
    );

    const setItemValueCallback = useCallback(
        (key: string, newValue: any) => {

            LOG.debug('setItemValue: ', key, newValue);

            const prevValue = get(propsValue, key, undefined);

            LOG.debug('setItemValue: propsValue = ', propsValue);
            LOG.debug('setItemValue: prevValue = ', prevValue);

            if ( prevValue !== newValue ) {
                const newModel = {
                    ...propsValue
                };
                set(newModel, key, newValue);
                return changeFormValueCallback(newModel);
            } else {
                LOG.debug('The form value did not change: ', key, newValue, prevValue, propsValue);
            }

        },
        [
            propsValue,
            changeFormValueCallback
        ]
    );

    const setItemStateCallback = useCallback(
        (key: string, newState: FormFieldState) => {
            LOG.debug('setItemState: ', key, newState);
            if ( fieldStates[key] !== newState ) {
                LOG.info(`_setItemState: State for "${key}" changed as ${newState}`);
                const newStates = {
                    ...fieldStates,
                    [key]: newState
                };
                setFieldStates(newStates);
            } else {
                LOG.debug(`_setItemState: State for "${key}" was already ${newState}`);
            }
        },
        [
            setFieldStates,
            fieldStates
        ]
    );

    const submitCallback = isLastPage  ? onSubmitButtonCallback : onNextButtonCallback;
    const cancelCallback = isFirstPage ? onCancelButtonCallback : onBackButtonCallback;

    return (
        <div className={
            MODEL_FORM_CLASS_NAME
            + (className ? ` ${className}` : '')
        }>

            <header className={MODEL_FORM_CLASS_NAME + '-header'}>
                <h2>{t(mainTitle)}</h2>
            </header>

            <section className={MODEL_FORM_CLASS_NAME + '-content'}>
                {map(pageItems, (item: FormFieldModel) => {

                    const globalIndex: number = allItems.indexOf(item);
                    const itemKey: string = item?.key ?? `${globalIndex}`;
                    const Component: any = FormUtils.getComponentForModel(item);

                    if ( Component ) {

                        const componentValue = get(propsValue, itemKey, undefined);

                        return (
                            <Component
                                key={`form-item-${globalIndex}`}
                                model={item}
                                value={componentValue}
                                change={(value: any) => setItemValueCallback(itemKey, value)}
                                changeState={(value: FormFieldState) => setItemStateCallback(itemKey, value)}
                            />
                        );
                    }

                    return (
                        <div key={`form-item-${globalIndex}`} />
                    );

                })}
            </section>

            <footer className={MODEL_FORM_CLASS_NAME + '-footer'}>

                {hasCancelProp ? (
                    <Button click={cancelCallback}>{t(cancelLabel)}</Button>
                ) : null}

                {hasSubmitProp ? (
                    <Button
                        type={ButtonType.SUBMIT}
                        enabled={fieldState !== FormFieldState.INVALID}
                        click={submitCallback}
                    >{t(submitLabel)}</Button>
                ) : null}

            </footer>

        </div>
    );

}

function getCombinedFieldState (
    states: ModelFormFieldStateObject,
    model: FormModel
): FormFieldState {

    const modelKeys: string[] = map(
        model.items,
        (item: FormItem, index: number): string => {
            return isFormFieldModel(item) ? (item?.key ?? `${index}`) : `${index}`;
        }
    );
    LOG.debug(`getCombinedFieldState: modelKeys = `, modelKeys);

    const stateKeys: string[] = filter(
        keys(states),
        (key: string) => modelKeys.includes(key)
    );
    LOG.debug(`getCombinedFieldState: stateKeys = `, stateKeys);

    const activeFieldStates: FormFieldState[] = map(
        stateKeys,
        (key: string): FormFieldState => states[key]
    );
    LOG.debug(`getCombinedFieldState: activeFieldStates = `, activeFieldStates);

    if ( activeFieldStates.includes(FormFieldState.INVALID) ) {
        return FormFieldState.INVALID;
    }

    if ( every(activeFieldStates, (item: FormFieldState): boolean => item === FormFieldState.VALID) ) {
        return FormFieldState.VALID;
    }

    return FormFieldState.CONSTRUCTED;

}
