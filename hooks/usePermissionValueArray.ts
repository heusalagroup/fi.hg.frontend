// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect, useState } from "react";
import { PermissionUtils, PermissionValueObject } from "../../core/PermissionUtils";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('usePermissionValueArray');

export function usePermissionValueArray<T extends string> (
    showPermissions: readonly T[],
    enabledPermissions: readonly T[]
) : readonly PermissionValueObject<T>[] {
    const [list, setList] = useState<readonly PermissionValueObject<T>[]>(
        () => {
            const list = PermissionUtils.createPermissionValueObjectArray(showPermissions, enabledPermissions);
            LOG.debug(`init: permissions = `, showPermissions, enabledPermissions, list);
            return list;
        }
    );
    useEffect(
        () => {
            const list = PermissionUtils.createPermissionValueObjectArray(showPermissions, enabledPermissions);
            LOG.debug(`changed: permissions = `, showPermissions, enabledPermissions, list);
            setList( list );
        },
        [
            showPermissions,
            enabledPermissions,
            setList
        ]
    )
    return list;
}
