// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Observer, ObserverCallback, ObserverDestructor} from "../../../core/Observer";
import { LogService } from "../../../core/LogService";

const LOG = LogService.createLogger('DragManager');

export enum DraggableElementEvent {

    DRAG_START = "DragManager:element:dragStart",
    DESTROYED = "DragManager:element:destroyed",

}

export enum DropEffect {
    COPY = "copy",
    MOVE = "move",
    LINK = "link"
}

export class DraggableElementManager<T extends Element> {

    public static Event = DraggableElementEvent;

    private readonly _dragStartCallback : (ev: any) => void;
    private readonly _element           : T;
    private readonly _id                : string;
    private readonly _observer          : Observer<DraggableElementEvent>;

    private _dataString : string;

    constructor (id : string, element : T) {

        this._id = id;
        this._dataString = '[]';
        this._element = element;
        this._dragStartCallback = this._onDragStart.bind(this);
        this._observer = new Observer<DraggableElementEvent>("DraggableElementManager");

        element.addEventListener("dragstart", this._dragStartCallback);

    }

    private _onDragStart (ev : any) {

        LOG.debug('on drag start')

        ev.dataTransfer.dropEffect = DropEffect.MOVE;

        ev.dataTransfer.setData("text/plain", this._id);
        ev.dataTransfer.setData("application/json", this._dataString);

        if (this._observer.hasCallbacks(DraggableElementEvent.DRAG_START)) {
            this._observer.triggerEvent(DraggableElementEvent.DRAG_START);
        }

    }

    destroy () {

        this._element.removeEventListener("dragstart", this._dragStartCallback);

        if (this._observer.hasCallbacks(DraggableElementEvent.DESTROYED)) {
            this._observer.triggerEvent(DraggableElementEvent.DESTROYED);
        }

    }

    public on (name : DraggableElementEvent, callback : ObserverCallback<DraggableElementEvent>) : ObserverDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public setDropData (data: any[]) {
        this._dataString = JSON.stringify(data);
    }

}

export class DragManager {

    public static createDraggableElementManager<T extends Element> (id : string, element: T) {
        return new DraggableElementManager<T>(id, element);
    }

}


