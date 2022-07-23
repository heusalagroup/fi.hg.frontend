// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ModalType } from "./ModalType";
import { JsonAny } from "../../core/Json";

export type ModalComponentType = any;

let MODAL_ID_SEQUENCER = 0;

export class Modal {

    private readonly _id            : string;
    private readonly _component     : ModalComponentType;
    private readonly _type          : ModalType;
    private readonly _enableOverlay : boolean;

    public constructor (
        component     : ModalComponentType,
        type          : ModalType          = ModalType.CENTER,
        enableOverlay : boolean            = true
    ) {

        const id = MODAL_ID_SEQUENCER += 1;

        this._id             = `Modal_${id}`;
        this._component      = component;
        this._type           = type;
        this._enableOverlay  = enableOverlay;

    }

    public getId (): string {
        return this._id;
    }

    /**
     * Overlay is an grey are around the modal which will close the modal if clicked.
     *
     * If overlay is not enabled, user can still click and access area around the modal.
     */
    public isOverlayEnabled () : boolean {
        return this._enableOverlay;
    }

    public getComponent (): any {
        return this._component;
    }

    public getType (): ModalType {
        return this._type;
    }

    public toString (): string {
        return this._id;
    }

    public toJSON (): JsonAny {
        return {
            type           : 'Modal',
            id             : this._id,
            modalType      : this._type,
            overlayEnabled : this._enableOverlay
        };
    }

}

export function isModal (value: any): value is Modal {
    return value instanceof Modal;
}


