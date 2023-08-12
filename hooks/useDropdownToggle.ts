// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    useState,
    useCallback
} from "react";
import { LogService } from "../../core/LogService";
import { useWindowSizeChange } from "./useWindowSizeChange";
import { useLocationChange } from "./useLocationChange";
import { useScrollTopChange } from "./useScrollTopChange";
import { VoidCallback } from "../../core/interfaces/callbacks";

const LOG = LogService.createLogger('useDropdownToggle');

/**
 *
 * @param context Logging context, e.g. parent's name.
 * @param initialState
 */
export function useDropdownToggle (
    // @ts-ignore @todo why unused?
    context: string,
    initialState: boolean = false
) : [boolean, VoidCallback, VoidCallback, VoidCallback] {
    const [ isDropdownOpen, setDropdownOpen ] = useState<boolean>(initialState);
    const toggleMenuCallback = useCallback(
        () => {
            LOG.debug('Toggling dropdown menu');
            setDropdownOpen(() => !isDropdownOpen);
        },
        [
            setDropdownOpen,
            isDropdownOpen
        ]
    );
    const openMenuCallback = useCallback(
        () => {
            LOG.debug('Opening dropdown menu');
            setDropdownOpen(false);
        },
        [
            setDropdownOpen
        ]
    );
    const closeMenuCallback = useCallback(
        () => {
            LOG.debug('Closing dropdown menu');
            setDropdownOpen(false);
        },
        [
            setDropdownOpen
        ]
    );
    useWindowSizeChange('useDropdownToggle', closeMenuCallback);
    useLocationChange('useDropdownToggle', closeMenuCallback);
    useScrollTopChange('useDropdownToggle', closeMenuCallback);
    return [ isDropdownOpen, toggleMenuCallback, closeMenuCallback, openMenuCallback ];
}
