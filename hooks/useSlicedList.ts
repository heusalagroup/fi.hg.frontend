// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect, useState } from "react";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useSlicedList');

/**
 * Slice a `sourceList` array of `T`'s to maximum items of `endCount`
 *
 * @param sourceList Array of Ts which should be sliced at maximum length of `endCount`
 * @param endCount The maximum amount of items in the result array
 * @returns The sliced array
 */
export function useSlicedList<T> (
    sourceList ?: readonly T[] | undefined,
    endCount   ?: number
): readonly T[] | undefined {
    const [ list, setList ] = useState<readonly T[] | undefined>(undefined);
    useEffect(
        () => {
            LOG.debug(`List needs slicing from ${sourceList?.length} items to ${endCount} items`);
            setList(
                () => {
                    const newList = sourceList ? sourceList.slice(0, endCount) : undefined;
                    LOG.debug(`List sliced from ${sourceList?.length} items to ${newList?.length} items`);
                    return newList;
                }
            );
        },
        [
            setList,
            sourceList,
            endCount
        ]
    );
    return list;
}
