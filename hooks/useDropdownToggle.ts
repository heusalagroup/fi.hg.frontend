// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useLocation } from "react-router-dom";
import { useWindowSize } from "./useWindowSize";
import { LogService } from "../../core/LogService";
import { useScrollTop } from "./useScrollTop";

const LOG = LogService.createLogger('useDropdownToggle');

export type SetProfileMenuOpenCallback = Dispatch<SetStateAction<boolean>>;

export function useDropdownToggle (initialState: boolean = false) : [boolean, SetProfileMenuOpenCallback] {

    const [ isDropdownOpen, setDropdownOpen ] = useState<boolean>(initialState);

    const location = useLocation();
    const windowSize = useWindowSize();
    const scrollTop = useScrollTop(window?.document?.scrollingElement);

    // When window size changes, close menu
    useEffect(
        () => {
            LOG.debug('Closing dropdown menu since window size changed');
            setDropdownOpen(false);
        },
        [
            windowSize,
            setDropdownOpen
        ]
    );

    // When location changes, close menu
    useEffect(
        () => {
            LOG.debug('Closing dropdown menu since location changed');
            setDropdownOpen(false);
        },
        [
            location,
            setDropdownOpen
        ]
    );

    // When scroll changes
    useEffect(
        () => {
            LOG.debug('Closing dropdown menu since location changed');
            setDropdownOpen(false);
        },
        [
            scrollTop,
            setDropdownOpen
        ]
    );

    return [ isDropdownOpen, setDropdownOpen ];

}
