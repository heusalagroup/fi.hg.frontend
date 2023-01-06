// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    ChangeEvent,
    KeyboardEvent,
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { FormFieldState } from "../../types/FormFieldState";
import { useFieldChangeState } from "./useFieldChangeState";
import { LogService } from "../../../core/LogService";
import { useFieldIdentifier } from "./useFieldIdentifier";
import { SelectFieldItem } from "../../types/items/SelectFieldModel";
import { findIndex } from "../../../core/functions/findIndex";
import { useFieldValidateArrayValueCallback } from "./array/useFieldValidateArrayValueCallback";
import { useFieldArrayUpdateCallback } from "./array/useFieldArrayUpdateCallback";
import { FieldChangeCallback, useFieldChangeCallback } from "./useFieldChangeCallback";
import { useDelayedCallback } from "../useDelayedCallback";
import { useMountEffect } from "../useMountEffect";
import { useSelectItemCallback } from "./array/useSelectItemCallback";
import { some } from "../../../core/functions/some";

const LOG = LogService.createLogger('useSelectField');

export function useSelectField<T> (
    label: string,
    key: string,
    change: FieldChangeCallback<T | undefined> | undefined,
    changeState: FieldChangeCallback<FormFieldState> | undefined,
    propsValue: T | undefined,
    propsValues: readonly SelectFieldItem<T>[] | undefined,
    isRequired: boolean,
    closeDropdownTimeoutOnBlur: number,
    moveToItemOnOpenDropdownTimeout: number
) {

    const identifier = useFieldIdentifier(key, label);

    const [ currentItemIndex, setCurrentItemIndex ] = useState<number | undefined>(undefined);
    const [ dropdownOpen, setDropdownOpen ] = useState<boolean>(false);
    const [ fieldState, setFieldState ] = useState<FormFieldState>(FormFieldState.CONSTRUCTED);
    const [ searchField, setSearchField ] = useState<string | undefined>('');

    const currentItem: SelectFieldItem<T> | undefined = currentItemIndex !== undefined && propsValues !== undefined ? propsValues[currentItemIndex] : undefined;
    const currentItemLabel: string = currentItem?.label ?? '';

    const inputRef = useRef<HTMLInputElement>(null);
    const buttonRefsRef = useRef<RefObject<HTMLButtonElement>[]>([]);

    /**
     * Search the index of the value in all items
     */
    const findValueIndexCallback = useCallback(
        (value: any): number | undefined => {

            LOG.debug(`${identifier}: _findValueIndex: value: `, value, propsValues);

            const index: number = propsValues !== undefined ? findIndex(
                propsValues,
                (item: SelectFieldItem<T>): boolean => item.value === value
            ) : -1;

            if ( index >= 0 && index < (propsValues?.length ?? 0) ) {
                LOG.debug(`${identifier}: _findValueIndex: found: `, index);
                return index;
            }

            LOG.debug(`${identifier}: _findValueIndex: not found`);
            return undefined;

        }, [
            identifier,
            propsValues
        ]
    );

    const updateSearchFieldCallback = useCallback(
        () => {
            if(searchField) setSearchField('')
        },
        [
            searchField
        ]
    )

    const updateCurrentItemIndexCallback = useCallback(
        () => {
            setCurrentItemIndex(() => propsValue !== undefined ? findValueIndexCallback(propsValue) : undefined);
        },
        [
            propsValue,
            findValueIndexCallback
        ]
    );

    const getCurrentIndexCallback = useCallback(
        (): number | undefined => {
            return propsValue !== undefined ? findValueIndexCallback(propsValue) : undefined;
        },
        [
            findValueIndexCallback,
            propsValue
        ]
    );

    const changeCallback = useFieldChangeCallback<T>(
        identifier,
        change
    );

    const closeDropdownCallback = useCallback(
        () => {

            LOG.debug(`${identifier}: Closing dropdown`);
            setDropdownOpen(false);

            // This code might have some intended functionality but not sure
            // right now. If focus is set here on the input element, the mount
            // callback will re-open the dropdown again, which clearly isn't
            // what we usually want.
            //
            //const inputEl = inputRef?.current;
            //if ( inputEl ) {
            //    LOG.debug(`${identifier}: Setting focus on input element`, inputEl);
            //    inputEl.focus();
            //}

        },
        [
            identifier,
            setDropdownOpen,
            // , inputRef // See above comment
        ]
    );

    const selectItemCallback = useSelectItemCallback(
        identifier,
        propsValues,
        changeCallback,
        closeDropdownCallback
    );

    const inputHasFocusCallback = useCallback(
        (): boolean => {

            if ( !document.hasFocus() ) {
                return false;
            }

            const inputElement: HTMLInputElement | null | undefined = inputRef?.current;

            const inputElementHasFocus: boolean = inputElement ? elementHasFocus(inputElement) : false;

            return inputElementHasFocus || some(buttonRefsRef.current, (item: RefObject<HTMLButtonElement>): boolean => {
                const currentElement: HTMLButtonElement | null | undefined = item?.current;
                return currentElement ? elementHasFocus(currentElement) : false;
            });

        },
        []
    );

    const openDropdownCallback = useCallback(
        () => {
            setDropdownOpen(true);
        },
        []
    );

    const setButtonFocusCallback = useCallback(
        (index: number) => {
            if ( index < buttonRefsRef.current.length ) {
                const el = buttonRefsRef.current[index]?.current;
                if ( el ) {
                    LOG.debug(`${identifier}: Setting focus on element `, el);
                    el.focus();
                } else {
                    LOG.warn(`${identifier}: _setButtonFocus: No button element found for index ${index}`);
                }
            } else {
                LOG.warn(`${identifier}: _setButtonFocus: No button ref found for index ${index}`);
            }
        },
        [
            identifier
        ]
    );

    const openDropdownIfNotOpenCallback = useCallback(
        () => {
            setDropdownOpen(
                (currentValue: boolean) => {
                    if ( currentValue ) {
                        LOG.warn(`_openDropdownIfNotOpen: Dropdown was already open`);
                    }
                    return true;
                }
            );
        },
        [
            setDropdownOpen
        ]
    );

    const moveCurrentItemToCallback = useCallback(
        (nextItem: number) => {
            if ( propsValues !== undefined && nextItem >= 0 && nextItem < (propsValues?.length ?? 0) ) {
                LOG.debug(`${identifier}: _moveCurrentItemTo: Selecting ${nextItem}`);
                setButtonFocusCallback(nextItem);
                changeCallback(propsValues[nextItem].value);
                openDropdownIfNotOpenCallback();
            } else {
                LOG.warn(`Could not change to out of range index ${nextItem}`);
                return;
            }
        },
        [
            identifier,
            propsValues,
            setButtonFocusCallback,
            changeCallback,
            openDropdownIfNotOpenCallback
        ]
    );

    const moveToFirstItemCallback = useCallback(
        () => {
            if ( dropdownOpen ) {
                LOG.debug(`${identifier}: moveToFirstItemCallback: Dropdown was open, selecting first element`);
                moveCurrentItemToCallback(0);
            } else {
                LOG.warn(`${identifier}: moveToFirstItemCallback: Warning! Dropdown not open yet.`);
            }
        },
        [
            identifier,
            dropdownOpen,
            moveCurrentItemToCallback
        ]
    );

    const [ delayedMoveToFirstItemCallback, cancelDelayedMoveToFirstItemCallback ] = useDelayedCallback(
        moveToFirstItemCallback,
        moveToItemOnOpenDropdownTimeout
    );

    const updateCurrentItemFromFocusCallback = useCallback(
        () => {

            if ( !document.hasFocus() ) {
                LOG.debug(`${identifier}: _updateCurrentItemFromFocus: Document has no focus`);
                return;
            }

            const currentItem: number | undefined = getCurrentIndexCallback();
            const buttonIndex: number = findIndex(buttonRefsRef.current, (item: RefObject<HTMLButtonElement>): boolean => {
                const currentElement: HTMLButtonElement | null | undefined = item?.current;
                return currentElement ? elementHasFocus(currentElement) : false;
            });

            if ( buttonIndex < 0 ) {
                LOG.debug(`${identifier}: _updateCurrentItemFromFocus: No element found`);
                return;
            }

            if ( currentItem === buttonIndex ) {
                LOG.debug(`${identifier}: _updateCurrentItemFromFocus: Focus already on current item`);
                return;
            }

            if ( propsValues !== undefined && buttonIndex >= 0 && buttonIndex < propsValues.length ) {
                LOG.debug(`${identifier}: _updateCurrentItemFromFocus: Selecting item: `, buttonIndex);
                changeCallback(propsValues[buttonIndex].value);
            } else {
                LOG.warn(`${identifier}: _updateCurrentItemFromFocus: Could not change to out of range index ${buttonIndex}`);
            }

        },
        [
            changeCallback,
            getCurrentIndexCallback,
            identifier,
            propsValues
        ]
    );

    const onFocusCallback = useCallback(
        () => {
            if ( !dropdownOpen ) {
                LOG.debug(`${identifier}: Dropdown not open, opening it`);
                openDropdownCallback();
                delayedMoveToFirstItemCallback();
            } else {
                LOG.debug(`${identifier}: Dropdown was open, updating current item from focus`);
                updateCurrentItemFromFocusCallback();
            }
        },
        [
            identifier,
            dropdownOpen,
            openDropdownCallback,
            delayedMoveToFirstItemCallback,
            updateCurrentItemFromFocusCallback
        ]
    );

    const closeDropdownIfOpenCallback = useCallback(
        () => {
            if ( dropdownOpen ) {
                if ( !inputHasFocusCallback() ) {
                    LOG.debug(`${identifier}:_onBlur: Closing dropdown after timeout`);
                    closeDropdownCallback();
                } else {
                    LOG.debug(`${identifier}: _onBlur: Select has focus still; not closing dropdown.`);
                }
            } else {
                LOG.debug(`${identifier}: _onBlur: Dropdown is not open anymore`);
            }
        },
        [
            identifier,
            dropdownOpen,
            inputHasFocusCallback,
            closeDropdownCallback
        ]
    );

    const [ delayedCloseDropdownIfOpenCallback, cancelDelayedCloseDropdownIfOpenCallback ] = useDelayedCallback(
        closeDropdownIfOpenCallback,
        closeDropdownTimeoutOnBlur
    );

    const onBlurCallback = useCallback(
        () => {
            if ( dropdownOpen ) {
                delayedCloseDropdownIfOpenCallback();
            } else {
                LOG.debug(`${identifier}:_onBlur: Dropdown not open`);
            }
        },
        [
            dropdownOpen,
            identifier,
            delayedCloseDropdownIfOpenCallback
        ]
    );

    const moveNextItemCallback = useCallback(
        () => {

            const totalItems: number = propsValues?.length ?? 0;
            const currentItem: number | undefined = getCurrentIndexCallback();
            const nextItem: number = currentItem !== undefined ? currentItem + 1 : 0;
            const nextCurrentIndex: number = nextItem < totalItems ? nextItem : 0;

            if ( propsValues !== undefined && nextCurrentIndex >= 0 && nextCurrentIndex < totalItems ) {
                const itemValue = propsValues[nextCurrentIndex].value;
                LOG.debug(`${identifier}: _moveNextItem: Selecting ${nextCurrentIndex}: `, itemValue);
                changeCallback(itemValue);
                setButtonFocusCallback(nextCurrentIndex);
                openDropdownIfNotOpenCallback();
            } else {
                LOG.warn(`_moveNextItem: Could not change to out of range index ${nextCurrentIndex}`);
            }

        },
        [
            changeCallback,
            getCurrentIndexCallback,
            identifier,
            propsValues,
            setButtonFocusCallback,
            openDropdownIfNotOpenCallback
        ]
    );

    const movePrevItemCallback = useCallback(
        () => {
            const totalItems: number = propsValues?.length ?? 0;
            const currentItem: number | undefined = getCurrentIndexCallback();
            const nextItem: number = currentItem !== undefined ? currentItem - 1 : totalItems - 1;
            const nextCurrentIndex: number = nextItem >= 0 ? nextItem : totalItems - 1;
            if ( propsValues !== undefined && nextCurrentIndex >= 0 && nextCurrentIndex < totalItems ) {
                LOG.debug(`${identifier}: _movePrevItem: Selecting ${nextCurrentIndex}`);
                setButtonFocusCallback(nextCurrentIndex);
                changeCallback(propsValues[nextCurrentIndex].value);
                openDropdownIfNotOpenCallback();
            } else {
                LOG.warn(`${identifier}: _movePrevItem: Could not change to out of range index ${nextCurrentIndex}`);
            }
        },
        [
            changeCallback,
            getCurrentIndexCallback,
            identifier,
            openDropdownIfNotOpenCallback,
            propsValues,
            setButtonFocusCallback
        ]
    );

    const onEnterCallback = useCallback(
        () => {
            if ( dropdownOpen ) {
                LOG.debug(`${identifier}: onEnterCallback: Dropdown was open`);
                const currentItem = getCurrentIndexCallback();
                if ( currentItem !== undefined ) {
                    LOG.debug(`${identifier}: Selecting currentItem: `, currentItem);
                    selectItemCallback(currentItem);
                }
            } else {
                LOG.debug(`${identifier}: onEnterCallback: Dropdown was not open`);
                openDropdownCallback();
                delayedMoveToFirstItemCallback();
            }
        },
        [
            identifier,
            dropdownOpen,
            getCurrentIndexCallback,
            selectItemCallback,
            openDropdownCallback,
            delayedMoveToFirstItemCallback
        ]
    );

    const onKeyDownCallback = useCallback(
        (event: KeyboardEvent) => {

            LOG.debug(`${identifier}: _onKeyDown: Keycode set: `, event?.code);
            switch (event?.code) {

                case 'Enter':
                    cancelKeyEvent(event);
                    return onEnterCallback();

                case 'ArrowUp':
                    cancelKeyEvent(event);
                    return movePrevItemCallback();

                case 'ArrowDown':
                    cancelKeyEvent(event);
                    return moveNextItemCallback();

                case 'Tab':
                    return;

                case 'Backspace':
                    setSearchField('')
                    return
                case 'Escape':
                    if ( dropdownOpen ) {
                        cancelKeyEvent(event);
                        return closeDropdownCallback();
                    } else {
                        return
                    }
                default:

                    if(searchField && searchField.length < 5) {
                        setSearchField(prev => prev + event?.key.toLowerCase())
                    } else if (!searchField) {
                        setSearchField(prev => prev + event?.key.toLowerCase())
                    }
            }

            LOG.debug(`${identifier}: No keycode set: `, event?.code);
            cancelKeyEvent(event);

            if ( !dropdownOpen ) {
                LOG.debug(`${identifier}: Dropdown was no open, opening it`);
                openDropdownCallback();
                delayedMoveToFirstItemCallback();
            }

        },
        [
            searchField,
            //searchFieldOn,
            identifier,
            closeDropdownCallback,
            delayedMoveToFirstItemCallback,
            dropdownOpen,
            moveNextItemCallback,
            movePrevItemCallback,
            onEnterCallback,
            openDropdownCallback
        ]
    );

    const validateStringValueCallback = useFieldValidateArrayValueCallback<T>(identifier, propsValues);

    const updateFieldStateCallback = useFieldArrayUpdateCallback<T>(
        identifier,
        fieldState,
        setFieldState,
        propsValue,
        isRequired,
        validateStringValueCallback
    );

    const mountCallback = useCallback(
        () => {
            if (!dropdownOpen) {
                if ( inputHasFocusCallback() ) {
                    LOG.debug(`${identifier}: Input had focus, opening the dropdown`);
                    openDropdownCallback();
                    delayedMoveToFirstItemCallback();
                } else {
                    LOG.debug(`${identifier}: Input did not have focus, not opening the dropdown`);
                }
            } else {
                LOG.debug(`${identifier}: Dropdown was already open`);
            }
            updateSearchFieldCallback()
            setFieldState(FormFieldState.MOUNTED);
            updateFieldStateCallback();
            updateCurrentItemIndexCallback();
        },
        [
            identifier,
            updateSearchFieldCallback,
            dropdownOpen,
            inputHasFocusCallback,
            openDropdownCallback,
            delayedMoveToFirstItemCallback,
            setFieldState,
            updateFieldStateCallback,
            updateCurrentItemIndexCallback,
        ]
    );

    const unmountCallback = useCallback(
        () => {
            cancelDelayedCloseDropdownIfOpenCallback();
            cancelDelayedMoveToFirstItemCallback();
            setFieldState(FormFieldState.UNMOUNTED);
        },
        [
            setFieldState,
            cancelDelayedCloseDropdownIfOpenCallback,
            cancelDelayedMoveToFirstItemCallback
        ]
    );

    useMountEffect(
        identifier,
        mountCallback,
        unmountCallback
    );

    // Update state when propsValue changes
    useEffect(
        () => {
            LOG.debug(`${identifier}: Props value changed: `, propsValue);
            updateFieldStateCallback();
            updateCurrentItemIndexCallback();
        },
        [
            identifier,
            propsValue,
            propsValues,
            updateFieldStateCallback,
            updateCurrentItemIndexCallback
        ]
    );

    // Update field state if props.model.required changes
    useEffect(
        () => {
            LOG.debug(`${identifier}: isRequired values changed`);
            updateFieldStateCallback();
        },
        [
            identifier,
            isRequired,
            updateFieldStateCallback
        ]
    );

    useFieldChangeState(changeState, fieldState);

    const onChangeCallback = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            cancelKeyEvent(event);
        },
        []
    );

    /*const onChangeBooleanCallback = useCallback(        // For testing checkbox only - search functionality on / off
        (event: ChangeEvent<HTMLInputElement>) => {
            if(event) {
                setSearchFieldOn(!searchFieldOn);
            }
        },
        [
            searchFieldOn
        ]
    );*/

    return {
        fieldState,
        label,
        inputRef,
        dropdownOpen,
        currentItemLabel,
        currentItemIndex,
        selectItemCallback,
        onFocusCallback,
        onBlurCallback,
        onKeyDownCallback,
        onChangeCallback,
        buttonRefs: buttonRefsRef.current,
        searchField,
    };

}

function elementHasFocus (el: HTMLInputElement | HTMLButtonElement): boolean {
    return el.contains(document.activeElement);
}

function cancelKeyEvent (event: KeyboardEvent | ChangeEvent) {
    if ( event ) {
        event.stopPropagation();
        event.preventDefault();
    }
}
