// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum FormFieldState {

    /**
     * The component's initial state.
     */
    CONSTRUCTED,

    /**
     * Component has been mounted, but validation has not been done yet.
     * This may happen if the validation is asynchronous, for example.
     */
    MOUNTED,

    /**
     * Field's state has been validated as correct
     */
    VALID,

    /**
     * Field's state has been validated as incorrect
     */
    INVALID,

    /**
     * Component was destroyed
     */
    UNMOUNTED

}

export function isFormFieldState (value: any): value is FormFieldState {
    switch (value) {

        case FormFieldState.CONSTRUCTED:
        case FormFieldState.MOUNTED:
        case FormFieldState.VALID:
        case FormFieldState.INVALID:
        case FormFieldState.UNMOUNTED:
            return true;

        default:
            return false;

    }
}

export function stringifyFormFieldState (value: FormFieldState): string {
    switch (value) {
        case FormFieldState.CONSTRUCTED  : return 'constructed';
        case FormFieldState.MOUNTED      : return 'mounted';
        case FormFieldState.INVALID      : return 'invalid';
        case FormFieldState.VALID        : return 'valid';
        case FormFieldState.UNMOUNTED    : return 'unmounted';
        default                          : return `FormFieldState#${value}`
    }
}

export function parseFormFieldState (value: any): FormFieldState | undefined {
    switch (`${value}`.toLowerCase()) {
        case 'constructed' : return FormFieldState.CONSTRUCTED;
        case 'mounted'     : return FormFieldState.MOUNTED;
        case 'invalid'     : return FormFieldState.INVALID;
        case 'valid'       : return FormFieldState.VALID;
        case 'unmounted'   : return FormFieldState.UNMOUNTED;
        default            : return undefined;
    }
}


