// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useRef } from "react";

export function useIdSequence () : number {
    const idRef = useRef<number | undefined>( undefined );
    if (idRef.current === undefined) {
        idRef.current = getNextId();
    }
    return idRef.current;
}

let ID_SEQUENCE : number = 0;

function getNextId () : number {
    ID_SEQUENCE += 1;
    return ID_SEQUENCE;
}
