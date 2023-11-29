// Copyright (c) 2022-2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { isEqual } from "../../core/functions/isEqual";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('useAsyncResource');

const INITIAL_LOAD_TIMEOUT : number = 500;
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

            let deleted : boolean = false;
            let errorRetryTimeout : any | undefined = undefined;
            let startTimeout : any | undefined = setTimeout(
                () : void => {
                    startTimeout = undefined;
                    LOG.debug(`refreshCallback: Calling...`);
                    callback().then( (newResult : T) : void => {
                        if (deleted) return;
                        if (!isEqual(result, newResult)) {
                            LOG.debug(`refreshCallback: Result updated: `, newResult);
                            setResult(newResult);
                        } else {
                            LOG.debug(`refreshCallback: Result was not different. Not changed: `, result);
                        }
                    }).catch((err) : void => {
                        if (deleted) return;
                        LOG.error(`refreshCallback: Error while fetching resource: `, err);
                        errorRetryTimeout = setTimeout(
                            () : void => {
                                if (deleted) return;
                                LOG.debug(`refreshCallback: Resetting result as undefined after a retry timeout`);
                                setResult(undefined);
                            },
                            FETCH_RETRY_TIMEOUT_ON_ERROR
                        );
                    });

                },
                INITIAL_LOAD_TIMEOUT
            );

            return () : void => {
                deleted = true;
                if (startTimeout !== undefined) {
                    clearTimeout(startTimeout);
                    startTimeout = undefined;
                }
                if (errorRetryTimeout !== undefined) {
                    clearTimeout(errorRetryTimeout);
                    errorRetryTimeout = undefined;
                }
            };

        },
        [
            result,
            setResult,
            callback
        ]
    );

    // Calls refresh callback if the result is undefined
    useEffect(
        () : void => {
            if ( result === undefined ) {
                LOG.debug(`Calling refresh callback`);
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
