// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ModalType } from "../types/ModalType";
import { Modal,  ModalComponentType } from "../types/Modal";
import { concat } from "../../core/functions/concat";
import { forEach } from "../../core/functions/forEach";
import { remove } from "../../core/functions/remove";
import { Observer,  ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { LogService } from "../../core/LogService";

const LOG = LogService.createLogger('ModalService');

export interface ModalDestructor {
    (): void;
}

export enum ModalServiceEvent {
    MODAL_CREATED         = "ModalService:modalCreated",
    MODAL_REMOVED         = "ModalService:modalRemoved",
    CURRENT_MODAL_CHANGED = "ModalService:currentModalChanged",
}

export interface ModalEventCallback {
    (eventType: ModalServiceEvent, modal: Modal): void;
}

export type ModalServiceDestructor = ObserverDestructor;

export class ModalService {

    private static readonly _modals   : Modal[]                     = [];
    private static readonly _observer : Observer<ModalServiceEvent> = new Observer<ModalServiceEvent>("ModalService");

    public static Event = ModalServiceEvent;

    public static getAllModals () : readonly Modal[] {
        return concat([], this._modals);
    }

    public static getCurrentModal () : Modal | undefined {

        if (this._modals.length) {
            return this._modals[this._modals.length - 1];
        } else {
            return undefined;
        }

    }

    public static createModal (
        component       : ModalComponentType,
        type            : ModalType = ModalType.CENTER,
        overlayEnabled  : boolean   = true,
        placeOnTop      : boolean   = true
    ) : ModalDestructor {

        LOG.debug(`createModal: `, component, type, overlayEnabled, placeOnTop);

        const modal = new Modal(component, type, overlayEnabled);

        if (placeOnTop) {
            this._modals.push(modal);
        } else {
            this._modals.unshift(modal);
        }

        if (this._observer.hasCallbacks(ModalServiceEvent.MODAL_CREATED)) {
            this._observer.triggerEvent(ModalServiceEvent.MODAL_CREATED, modal);
        }

        if ( placeOnTop && this._observer.hasCallbacks(ModalServiceEvent.CURRENT_MODAL_CHANGED) ) {
            this._observer.triggerEvent(ModalServiceEvent.CURRENT_MODAL_CHANGED, modal);
        }

        return () => {
            this.removeModal(modal);
        };

    }

    public static removeModal (
        modal : Modal
    ) {

        LOG.debug(`removeModal: modal: `, modal);

        const prevModal = this.getCurrentModal();
        LOG.debug(`removeModal: prevModal: `, prevModal);

        const removedModals = remove(this._modals, (item : Modal) : boolean => item === modal);
        LOG.debug(`removeModal: removedModals: `, removedModals);

        if (removedModals.length !== 0) {

            const isCurrentModal = prevModal === modal;
            LOG.debug(`removeModal: isCurrentModal: `, isCurrentModal);

            if (this._observer.hasCallbacks(ModalServiceEvent.MODAL_REMOVED)) {
                this._observer.triggerEvent(ModalServiceEvent.MODAL_REMOVED, modal);
            }

            if (isCurrentModal && this._observer.hasCallbacks(ModalServiceEvent.CURRENT_MODAL_CHANGED)) {
                this._observer.triggerEvent(ModalServiceEvent.CURRENT_MODAL_CHANGED, modal);
            }

        }

    }

    public static on (
        name     : ModalServiceEvent,
        callback : ObserverCallback<ModalServiceEvent>
    ): ModalServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public static destroy (): void {

        LOG.debug(`destroy called`);

        const modals = concat([], this._modals);
        forEach(modals, modal => {
            this.removeModal(modal);
        });

        this._observer.destroy();

    }

}


