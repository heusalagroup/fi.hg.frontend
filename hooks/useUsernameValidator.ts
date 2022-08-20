// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { VoidCallback } from "../../core/interfaces/callbacks";
import { useTextValidator } from "./useTextValidator";

/**
 * System username validator
 *
 * The name is limited to 10 characters because some programs will limit it if
 * longer, e.g. IRC nick will not work.
 *
 * @param username
 * @param required
 * @param acceptedStartChars
 * @param acceptedMiddleChars
 * @param acceptedEndChars
 */
export function useUsernameValidator (
    username: string | undefined,
    required: boolean = true,
    acceptedStartChars: string = 'qwertyuiopasdfghjklzxcvbnm',
    acceptedMiddleChars: string = 'qwertyuiopasdfghjklzxcvbnm_0123456789',
    acceptedEndChars: string = 'qwertyuiopasdfghjklzxcvbnm0123456789',
) : [boolean, VoidCallback] {
    return useTextValidator(
        username,
        required,
        acceptedStartChars,
        acceptedMiddleChars,
        acceptedEndChars,
        3,
        10
    );
}
