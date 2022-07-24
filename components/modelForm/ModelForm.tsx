// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Component } from 'react';
import { FormModel } from "../../types/FormModel";
import { FormFieldModel,  isFormFieldModel } from "../../types/FormFieldModel";
import { Button,  ButtonClickCallback} from "../button/Button";
import { FormUtils } from "../fields/FormUtils";
import {
    every,
    filter,
    get,
    keys,
    map,
    set
} from "../../../core/modules/lodash";
import { LogService } from "../../../core/LogService";
import { FormItem } from "../../types/FormItem";
import { PageBreakModel } from "../../types/items/PageBreakModel";
import { VoidCallback } from "../../../core/interfaces/callbacks";
import { FormFieldState } from "../../types/FormFieldState";
import { ButtonType } from "../button/types/ButtonType";
import { MODEL_FORM_CLASS_NAME } from "../../constants/hgClassName";
import { FieldChangeCallback } from "../../hooks/field/useFieldChangeCallback";
import './ModelForm.scss';

const LOG = LogService.createLogger('Form');

export interface ModelFormFieldStateObject {
    readonly [key: string]: FormFieldState;
}

export interface ModelFormState {
    readonly page        : number;
    readonly fieldStates : ModelFormFieldStateObject;
}

export interface ModelFormProps<ValueT> {
    readonly className ?: string;
    readonly model      : FormModel;
    readonly value      : ValueT;
    readonly change    ?: FieldChangeCallback<ValueT>;
    readonly cancel    ?: VoidCallback;
    readonly submit    ?: VoidCallback;
}

export class ModelForm extends Component<ModelFormProps<any>, ModelFormState> {

    private readonly _cancelCallback    : ButtonClickCallback;
    private readonly _submitCallback    : ButtonClickCallback;
    private readonly _backPageCallback  : ButtonClickCallback;
    private readonly _nextPageCallback  : ButtonClickCallback;


    public constructor(props: ModelFormProps<any>) {

        super(props);

        this.state = {
            page: 0,
            fieldStates: {}
        };

        this._cancelCallback   = this._onCancelButton.bind(this);
        this._submitCallback   = this._onSubmitButton.bind(this);
        this._nextPageCallback = this._onNextButton.bind(this);
        this._backPageCallback = this._onBackButton.bind(this);

    }

    public render () {

        const pageNumber : number                     = this.state.page;
        const spec       : FormModel                  = this.props.model;
        const mainTitle  : string = spec.title;
        const allItems   : FormItem[]                 = spec.items;

        const pageCount = FormUtils.getPageCount(allItems);

        if (pageNumber >= pageCount) {
            LOG.warn(`Warning! Page ${pageNumber} is invalid: We only had ${pageCount} pages`);
            return null;
        }

        const pageItems     : FormItem[] = pageCount === 1 ? allItems : FormUtils.getPageItems(pageNumber, allItems);
        const pageBreak     : PageBreakModel | undefined = pageCount === 1 ? undefined : FormUtils.getPageBreak(pageNumber, allItems);
        const prevPageBreak : PageBreakModel | undefined = pageCount === 1 || pageNumber <= 0 ? undefined : FormUtils.getPageBreak(pageNumber - 1, allItems);

        const isFirstPage : boolean = pageNumber === 0;
        const isLastPage  : boolean = pageNumber === pageCount - 1;

        const cancelCallback          = isFirstPage ? this._cancelCallback            : this._backPageCallback;
        const cancelLabel   : string  = isFirstPage ? (spec?.cancelLabel ?? 'Cancel') : (prevPageBreak?.backLabel ?? 'Back');
        const hasCancelProp : boolean = isFirstPage ? !!this.props.cancel             : true;

        const submitCallback          = isLastPage  ? this._submitCallback            : this._nextPageCallback;
        const submitLabel   : string  = isLastPage  ? (spec?.submitLabel ?? 'Submit') : (pageBreak?.nextLabel ?? 'Next page');
        const hasSubmitProp : boolean = isLastPage  ? !!this.props.submit             : true;

        const fieldState : FormFieldState = ModelForm.getCombinedFieldState(
            this.state.fieldStates,
            spec
        );

        return (
            <div className={MODEL_FORM_CLASS_NAME}>

                <header className={MODEL_FORM_CLASS_NAME + '-header'}>
                    <h2>{mainTitle}</h2>
                </header>

                <section className={MODEL_FORM_CLASS_NAME + '-content'}>
                    {map(pageItems, (item : FormFieldModel) => {

                        const globalIndex : number = allItems.indexOf(item);
                        const itemKey     : string = item?.key ?? `${globalIndex}`;
                        const Component   : any    = FormUtils.getComponentForModel(item);

                        if (Component) {

                            const valueModel : any = this.props.value;
                            const componentValue = get(valueModel, itemKey, undefined);

                            return (
                                <Component
                                    key={`form-item-${globalIndex}`}
                                    model={item}
                                    value={componentValue}
                                    change={(value: any) => this._setItemValue(itemKey, value)}
                                    changeState={(value: FormFieldState) => this._setItemState(itemKey, value)}
                                />
                            );
                        }

                        return (
                            <div
                                key={`form-item-${globalIndex}`}
                            />
                        );

                    })}
                </section>

                <footer className={MODEL_FORM_CLASS_NAME + '-footer'}>

                    {hasCancelProp ? (
                        <Button click={cancelCallback}>{cancelLabel}</Button>
                    ) : null}

                    {hasSubmitProp ? (
                        <Button
                            type={ButtonType.SUBMIT}
                            enabled={ fieldState !== FormFieldState.INVALID }
                            click={submitCallback}
                        >{submitLabel}</Button>
                    ) : null}

                </footer>

            </div>
        );

    }


    private _onCancelButton () {

        try {
            if (this.props.cancel) {
                this.props.cancel();
            } else {
                LOG.warn('No cancel prop defined!');
            }
        } catch(err) {
            LOG.error('Error while executing cancel prop: ' + err);
        }

    }

    private _onSubmitButton () {

        try {
            if (this.props.submit) {
                this.props.submit();
            } else {
                LOG.warn('No submit prop defined!');
            }
        } catch(err) {
            LOG.error('Error while executing submit prop: ' + err);
        }

    }

    private _onNextButton () {

        this.setState((state : ModelFormState) => {

            const pageCount = FormUtils.getPageCount(this.props.model.items);
            const nextPage  = state.page + 1;

            if (nextPage < pageCount) {
                return {page: nextPage};
            } else {
                return {page: state.page};
            }

        });

    }

    private _onBackButton () {
        this.setState((state : ModelFormState) => ({page: state.page - 1 >= 0 ? state.page - 1 : 0 }));
    }

    private _changeFormValue (newValue: any) {
        try {
            if (this.props.change) {
                this.props.change(newValue);
            } else {
                LOG.warn('No change prop defined!');
            }
        } catch(err) {
            LOG.error('Error while executing change prop: ' + err);
        }
    }

    private _setItemValue (key: string, newValue: any) {

        LOG.debug('_setItemValue: ', key, newValue);

        const valueModel : any = this.props.value;
        const prevValue = get(valueModel, key, undefined);

        LOG.debug('_setItemValue: valueModel = ', valueModel);
        LOG.debug('_setItemValue: prevValue = ', prevValue);

        if (prevValue !== newValue) {
            const newModel = {
                ...valueModel
            };
            set(newModel, key, newValue);
            return this._changeFormValue(newModel);
        } else {
            LOG.debug('The form value did not change: ', key, newValue, prevValue, valueModel);
        }

    }

    private _setItemState (key : string, newState: FormFieldState) {

        LOG.debug('_setItemState: ', key, newState);

        const prevStates : ModelFormFieldStateObject = this.state.fieldStates;

        if (prevStates[key] !== newState) {

            LOG.info(`_setItemState: State for "${key}" changed as ${newState}`);

            const newStates = {
                ...prevStates,
                [key]: newState
            };

            this.setState({
                fieldStates: newStates
            });



        } else {
            LOG.debug(`_setItemState: State for "${key}" was already ${newState}`);
        }

    }


    public static getCombinedFieldState (
        states : ModelFormFieldStateObject,
        model  : FormModel
    ) : FormFieldState {

        const modelKeys : string[] = map(
            model.items,
            (item : FormItem, index: number) : string => {
                return isFormFieldModel(item) ? ( item?.key ?? `${index}` ) : `${index}`;
            }
        );
        LOG.debug(`getCombinedFieldState: modelKeys = `, modelKeys);

        const stateKeys : string[] = filter(
            keys(states),
            (key : string) => modelKeys.includes(key)
        );
        LOG.debug(`getCombinedFieldState: stateKeys = `, stateKeys);

        const activeFieldStates : FormFieldState[] = map(
            stateKeys,
            (key: string) : FormFieldState => states[key]
        );
        LOG.debug(`getCombinedFieldState: activeFieldStates = `, activeFieldStates);

        if ( activeFieldStates.includes(FormFieldState.INVALID) ) {
            return FormFieldState.INVALID;
        }

        if ( every(activeFieldStates, (item : FormFieldState ) : boolean => item === FormFieldState.VALID) ) {
            return FormFieldState.VALID;
        }

        return FormFieldState.CONSTRUCTED;

    }

}


