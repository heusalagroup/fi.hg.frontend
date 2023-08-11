// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useState } from "react";
import { HelmetContext, HelmetContextServiceEvent } from "../services/HelmetContextService";
import { HelmetContextServiceImpl } from "../services/HelmetContextServiceImpl";
import { useServiceEvent } from "./useServiceEvent";

export function useHelmetContext () : HelmetContext {

    const [context, setContext] = useState<HelmetContext>( HelmetContextServiceImpl.getContext() );

    const eventCallback = useCallback(
        () => {
            setContext(
                HelmetContextServiceImpl.getContext()
            );
        },
        [
            setContext
        ]
    );

    // When session service changes data
    useServiceEvent<HelmetContextServiceEvent>(
        HelmetContextServiceImpl,
        HelmetContextServiceEvent.CONTEXT_UPDATED,
        eventCallback
    );

    return context;
}
