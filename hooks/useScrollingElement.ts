// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useDocument } from "./useDocument";

export function useScrollingElement () : Element | undefined {
    const document = useDocument();
    const element = document?.scrollingElement;
    return element ? element : undefined;
}
