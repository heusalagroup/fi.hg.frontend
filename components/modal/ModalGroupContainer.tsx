// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Modal } from "../../types/Modal";
import {
    ModalService,
    ModalServiceEvent
} from "../../services/ModalService";
import { LogService } from "../../../core/LogService";
import { map } from "../../../core/functions/map";
import { ModalContainer } from "./ModalContainer";
import { MODAL_GROUP_CONTAINER_CLASS_NAME } from "../../constants/hgClassName";
import { useCallback, useState } from "react";
import { useServiceEvent } from "../../hooks/useServiceEvent";
import { useMountEffect } from "../../hooks/useMountEffect";
import "./ModalGroupContainer.scss";

const LOG = LogService.createLogger('ModalGroupContainer');

export interface ModalGroupContainerProps {
    readonly className?: string;
}

export function ModalGroupContainer (props: ModalGroupContainerProps) {

    const className = props?.className;

    const [ modals, setModals ] = useState<readonly Modal[]>([]);

    LOG.debug(`render: modals =`, modals);

    const updateStateCallback = useCallback(
        () => {
            const modals = ModalService.getAllModals();
            LOG.debug(`_updateState: setting state as: modals =`, modals);
            setModals(modals);
        },
        [
            setModals
        ]
    );

    const onModalCloseCallback = useCallback(
        (modal: Modal) => {
            if ( modal !== undefined ) {
                LOG.debug(`_onCloseModal: closing modal: modal =`, modal);
                ModalService.removeModal(modal);
            } else {
                LOG.debug(`_onCloseModal: no modal detected`);
            }
        },
        []
    );

    const onCurrentModalChangeCallback = useCallback(
        () => {
            LOG.debug(`_onCurrentModalChange: updating state`);
            updateStateCallback();
        },
        [
            updateStateCallback
        ]
    );

    const componentDidMountCallback = useCallback(
        (): void => {
            LOG.debug(`_onCurrentModalChange: updating state`);
            updateStateCallback();
        },
        [
            updateStateCallback
        ]
    );

    useMountEffect(
        'ModalGroupContainer',
        componentDidMountCallback
    );

    useServiceEvent<ModalServiceEvent>(
        ModalService,
        ModalServiceEvent.MODAL_CREATED,
        onCurrentModalChangeCallback
    );

    useServiceEvent<ModalServiceEvent>(
        ModalService,
        ModalServiceEvent.MODAL_REMOVED,
        onCurrentModalChangeCallback
    );

    if ( modals.length === 0 ) {
        LOG.debug(`render: No modal detected`);
        return null;
    }

    return (
        <div
            className={
                MODAL_GROUP_CONTAINER_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
        >{map(modals, (item: Modal/*, itemIndex: number*/) => {
            return (
                <ModalContainer
                    key={`modal-${item.getId()}`}
                    className={MODAL_GROUP_CONTAINER_CLASS_NAME + '-item'}
                    modal={item}
                    close={onModalCloseCallback}
                />
            );
        })}</div>
    );

}
