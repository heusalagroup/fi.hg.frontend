// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { VoidCallback } from "../../core/interfaces/callbacks";
import { useHandleError } from "./useHandleError";
import { useWarningLogger } from "./useWarningLogger";
import { useDebugLogger } from "./useDebugLogger";
import { isPromise } from "../../core/types/Promise";

export function useVoidCallback (
    context: string | undefined,
    callback: VoidCallback
) {
    const subContext = `${context}.useVoidCallback`;
    const handleError = useHandleError(subContext);
    const writeWarning = useWarningLogger(subContext);
    const writeDebug = useDebugLogger(subContext);
    return useCallback(
        () => {
            try {
                if (callback) {
                    writeDebug(`Calling callback`);
                    const p : unknown = callback();
                    if (isPromise(p)) {
                        p.catch(handleError);
                    }
                } else {
                    writeWarning(`No callback defined`);
                }
            } catch (err) {
                handleError(err);
            }
        },
        [
            callback,
            handleError,
            writeDebug,
            writeWarning
        ]
    );
}
