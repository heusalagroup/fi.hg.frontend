// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useLocation } from "react-router-dom";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useDropdownToggle');

export type SetProfileMenuOpenCallback = Dispatch<SetStateAction<boolean>>;

export function useDropdownToggleWithoutWindowSizeAndScroll(initialState: boolean = false): [boolean, SetProfileMenuOpenCallback] {

    const [isDropdownOpen, setDropdownOpen] = useState<boolean>(initialState);

    const location = useLocation();

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

    return [isDropdownOpen, setDropdownOpen];

}
