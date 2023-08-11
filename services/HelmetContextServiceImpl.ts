// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Observer, ObserverCallback } from "../../core/Observer";
import { Disposable } from "../../core/types/Disposable";
import { createHelmetContext, HelmetContext, HelmetContextService, HelmetContextServiceDestructor, HelmetContextServiceEvent } from "./HelmetContextService";

/**
 * This is a context service for server side (SSR) helmet contexts
 */
export class HelmetContextServiceImpl implements HelmetContextService, Disposable {

    private _observer: Observer<HelmetContextServiceEvent>;
    private _context : HelmetContext;

    public static Event = HelmetContextServiceEvent;

    public static create () : HelmetContextService {
        return new HelmetContextServiceImpl();
    }

    protected constructor () {
        this._context = createHelmetContext();
        this._observer = new Observer<HelmetContextServiceEvent>( "HelmetContextServiceImpl" );
    }

    public getContext (): HelmetContext {
        return this._context;
    }

    public on (
        name: HelmetContextServiceEvent,
        callback: ObserverCallback<HelmetContextServiceEvent>
    ): HelmetContextServiceDestructor {
        return this._observer.listenEvent( name, callback );
    }

    public destroy (): void {
        this._observer.destroy();
        this._context = {};
    }

}
