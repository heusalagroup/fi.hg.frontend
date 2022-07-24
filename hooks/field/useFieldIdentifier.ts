// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

export function useFieldIdentifier (
    key: string,
    label: string
) : string {
    return `#${key}: "${label}"`;
}
