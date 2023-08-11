// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { HelmetServerState } from "react-helmet-async";
import { ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { Disposable } from "../../core/types/Disposable";

export interface HelmetContext {
    helmet ?: HelmetServerState;
}

export function createHelmetContext () : HelmetContext {
    return {};
}

export enum HelmetContextServiceEvent {
    CONTEXT_UPDATED = "helmetContextService:contextUpdated"
}

export type HelmetContextServiceDestructor = ObserverDestructor;

export interface HelmetContextService extends Disposable {

    on (
        name: HelmetContextServiceEvent,
        callback: ObserverCallback<HelmetContextServiceEvent>
    ): HelmetContextServiceDestructor;

    destroy (): void;

    getContext () : HelmetContext;

}
