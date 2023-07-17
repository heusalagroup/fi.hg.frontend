// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { useLocation, Location, useNavigate } from "react-router-dom";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger( 'useQueryParams' );

export type SetQueryParamCallback = (newValue: string | undefined) => void;

/**
 * Use query parameter without default value.
 *
 * @param key The keyword of the query parameter
 */
export function useQueryParam (
    key : string
) : [string | undefined, SetQueryParamCallback];

/**
 * Use query parameter with a user-defined default value.
 *
 * @param key The keyword of the query parameter
 * @param defaultValue The default value of the query parameter
 */
export function useQueryParam (
    key           : string,
    defaultValue  : string
) : [string, SetQueryParamCallback];

/**
 * Use query parameter with a user-defined default value.
 *
 * @param key The keyword of the query parameter
 * @param defaultValue The default value of the query parameter
 */
export function useQueryParam (
    key           : string,
    defaultValue  : string | undefined
) : [string | undefined, SetQueryParamCallback];

export function useQueryParam (
    key           : string,
    defaultValue ?: string
) : [string | undefined, SetQueryParamCallback ] {
    const [param, setParam] = useState<string|undefined>(defaultValue);
    const location : Location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams : URLSearchParams = new URLSearchParams(location.search);
        const value : string | null = queryParams.get(key);
        if (value === null) {
            setParam(undefined);
            LOG.debug(`Changed '${param}' to undefined`);
        } else {
            setParam(value);
            LOG.debug(`Changed '${param}' to "${value}"`);
        }
    }, [
        key,
        location.search,
        param,
    ]);

    const setValue : SetQueryParamCallback = useCallback(
        (newValue: string | undefined) => {
            const queryParams : URLSearchParams = new URLSearchParams(location.search);
            if (newValue === undefined) {
                queryParams.delete(key);
            } else {
                queryParams.set(key, newValue);
            }
            const currentPath: string = location.pathname;
            const queryString : string = queryParams.toString();
            const newPath : string = queryString ? `${currentPath}?${queryString}` : currentPath;
            if (currentPath !== newPath) {
                LOG.debug(`Replacing path as: ${newPath}`);
                navigate(newPath, {replace: true});
            } else {
                LOG.debug(`No need to replace path: ${newPath}`);
            }
        },
        [
            key,
            location.pathname,
            location.search,
            navigate,
        ]
    );

    return [param, setValue];
}
