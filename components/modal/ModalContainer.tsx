// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MouseEvent, useCallback } from "react";
import { Modal } from "../../types/Modal";
import { ModalService } from "../../services/ModalService";
import { stringifyModalType } from "../../types/ModalType";
import { ChangeCallback, VoidCallback } from "../../../core/interfaces/callbacks";
import { LogService } from "../../../core/LogService";
import { stringifyStyleScheme, StyleScheme } from "../../types/StyleScheme";
import { ThemeService } from "../../services/ThemeService";
import { MODAL_CONTAINER_CLASS_NAME } from "../../constants/hgClassName";
import "./ModalContainer.scss";

const LOG = LogService.createLogger('ModalContainer');

export interface ModalContainerProps {
    readonly className ?: string;
    readonly style ?: StyleScheme;
    readonly modal : Modal;
    readonly close ?: ChangeCallback<Modal>;
}

export function ModalContainer (props: ModalContainerProps) {

    const className = props?.className;
    const close = props?.close;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();

    const modal = props?.modal;
    if ( !modal ) {
        LOG.debug(`render: No modal detected`);
        return null;
    }

    LOG.debug(`render: modal =`, modal);

    const onCloseModalCallback = useCallback(
        () => {

            if ( close ) {
                try {
                    close(modal);
                } catch (err) {
                    LOG.error(`onCloseModal: Could not close modal: `, err);
                }
            } else {
                if ( modal !== undefined ) {
                    LOG.debug(`onCloseModal: closing modal: modal =`, modal);
                    ModalService.removeModal(modal);
                } else {
                    LOG.debug(`onCloseModal: no modal detected`);
                }
            }
        },
        [
            close,
            modal
        ]
    );

    const onModalClickCallback = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            if ( event ) {
                LOG.debug(`_modalClickCallback: default click action cancelled`);
                event.stopPropagation();
                event.preventDefault();
            } else {
                LOG.debug(`_modalClickCallback: click detected`);
            }
        },
        []
    );

    const component = modal.getComponent();
    const type = modal.getType();
    const hasOverlay = modal.isOverlayEnabled();

    const containerProps: {onClick?: VoidCallback} = {};
    if ( hasOverlay ) {
        containerProps.onClick = onCloseModalCallback;
    }

    return (
        <div
            className={
                MODAL_CONTAINER_CLASS_NAME
                + (className ? ` ${className}` : '')
                + ` ${MODAL_CONTAINER_CLASS_NAME}-style-${stringifyStyleScheme(styleScheme)}`
                + ' ' + MODAL_CONTAINER_CLASS_NAME + '-type-' + (stringifyModalType(type))
                + ' ' + MODAL_CONTAINER_CLASS_NAME + '-overlay-' + (hasOverlay ? 'enabled' : 'disabled')
            }
            {...containerProps}
        >
            <div
                className={MODAL_CONTAINER_CLASS_NAME + '-content'}
                onClick={onModalClickCallback}
            >{component}</div>
        </div>
    );

}
