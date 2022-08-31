// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect, useState } from "react";
import { LogService } from "../../core/LogService";
import { moment } from "../../core/modules/moment";

const LOG = LogService.createLogger('useTimeString');

function toDateString (
    value  : string | undefined,
    format : string | undefined
) : string | undefined {
    try {
        return value && format ? moment(value).format(format) : undefined;
    } catch (err) {
        LOG.error(`Failed to stringify date value: "${value}" with format "${format}": `, err);
        return undefined;
    }
}

export function useTimeString (
    value  : string | undefined,
    format : string | undefined
) : string | undefined {
    const [displayValue, setDisplayValue] = useState<string | undefined>( toDateString(value, format) );
    useEffect(
        () => {
            setDisplayValue( toDateString(value, format) );
        },
        [
            setDisplayValue,
            value,
            format
        ]
    );
    return displayValue;
}
