// Copyright (c) 2022-2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { isEqual } from "../../core/functions/isEqual";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useAsyncResource');

const FETCH_RETRY_TIMEOUT_ON_ERROR : number = 3000;

export type RefreshCallback = () => void;

/**
 * The `useAsyncResource()` will use the callback to resolve a resource
 * asynchronously.
 *
 * The result will be `undefined` when initialized, and
 * `null` if the callback has been called and is loading the response.
 *
 * NOTE: If the callback resolves to `undefined`, it will be called again! You
 * can use `null` to have an empty value if no reload is intended.
 *
 * @param callback
 */
export function useAsyncResource<T> (
    callback: () => Promise<T>
) : [T | null | undefined, RefreshCallback] {

    const [ result, setResult ] = useState<T | undefined | null>(undefined);

    const refreshCallback = useCallback(
        () => {
            callback().then( (newResult : T) => {
                if (!isEqual(result, newResult)) {
                    setResult(newResult);
                } else {
                    LOG.debug(`Result was not different. Not changed.`);
                }
            }).catch((err) => {
                LOG.error(`Error while fetching resource: `, err);
                setTimeout(
                    () => {
                        setResult(undefined);
                    },
                    FETCH_RETRY_TIMEOUT_ON_ERROR
                );
            });
        },
        [
            setResult,
            callback
        ]
    );

    useEffect(
        () => {
            if ( result === undefined ) {
                setResult(null);
                refreshCallback();
            }
        },
        [
            result,
            setResult,
            refreshCallback
        ]
    );

    return [result, refreshCallback];

}
