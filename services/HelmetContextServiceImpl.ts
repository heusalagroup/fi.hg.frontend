// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Observer, ObserverCallback } from "../../core/Observer";
import { Disposable } from "../../core/types/Disposable";
import { createHelmetContext, HelmetContext, HelmetContextService, HelmetContextServiceDestructor, HelmetContextServiceEvent } from "./HelmetContextService";

export class HelmetContextServiceImpl implements HelmetContextService, Disposable {

    private static _observer: Observer<HelmetContextServiceEvent>;
    private static _context : HelmetContext;

    public static Event = HelmetContextServiceEvent;

    public static on (
        name: HelmetContextServiceEvent,
        callback: ObserverCallback<HelmetContextServiceEvent>
    ): HelmetContextServiceDestructor {
        return this._observer.listenEvent( name, callback );
    }

    public static destroy (): void {
        this._observer.destroy();
    }

    /**
     * Initialize the service. Must be called before or in HgReact.initialize().
     */
    public static initialize () : void {
        this._context = createHelmetContext();
        this._observer = new Observer<HelmetContextServiceEvent>( "HelmetContextServiceImpl" );
    }

    public static getContext (): HelmetContext {
        return HelmetContextServiceImpl._context;
    }

    protected constructor () {}

    public initialize (): void {
        HelmetContextServiceImpl.initialize();
    }

    public getContext (): HelmetContext {
        return HelmetContextServiceImpl._context;
    }

    public on (
        name: HelmetContextServiceEvent,
        callback: ObserverCallback<HelmetContextServiceEvent>
    ): HelmetContextServiceDestructor {
        return HelmetContextServiceImpl.on(name, callback);
    }

    public destroy (): void {
        HelmetContextServiceImpl.destroy();
    }

}
