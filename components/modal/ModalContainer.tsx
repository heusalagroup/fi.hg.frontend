// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Component , MouseEvent } from "react";
import { Modal } from "../../types/Modal";
import { ModalService } from "../../services/ModalService";
import { stringifyModalType } from "../../types/ModalType";
import { ChangeCallback, EventCallback, VoidCallback } from "../../../core/interfaces/callbacks";
import { LogService } from "../../../core/LogService";
import { stringifyStyleScheme, StyleScheme } from "../../types/StyleScheme";
import { ThemeService } from "../../services/ThemeService";
import { MODAL_CONTAINER_CLASS_NAME } from "../../constants/hgClassName";
import "./ModalContainer.scss";

const LOG = LogService.createLogger('ModalContainer');

export interface ModalContainerProps {

    readonly className ?: string;
    readonly style       ?: StyleScheme;
    readonly modal      : Modal;
    readonly close     ?: ChangeCallback<Modal>;

}

export interface ModalContainerState {
}

export class ModalContainer extends Component<ModalContainerProps, ModalContainerState> {

    public static defaultProps: Partial<ModalContainerProps> = {};

    private readonly _closeModalCallback  : VoidCallback;
    private readonly _modalClickCallback  : EventCallback<MouseEvent<HTMLDivElement>>;

    public constructor (props: ModalContainerProps) {

        super(props);

        this.state = {};

        this._closeModalCallback  = this._onCloseModal.bind(this);
        this._modalClickCallback  = this._onModalClick.bind(this);

    }

    public render () {

        const modal = this.props.modal;
        if (!modal) {
            LOG.debug(`render: No modal detected`);
            return null;
        }

        LOG.debug(`render: modal =`, modal);

        const component  = modal.getComponent();
        const type       = modal.getType();
        const hasOverlay = modal.isOverlayEnabled();

        const containerProps : {onClick?: VoidCallback} = {};
        if (hasOverlay) {
            containerProps.onClick = this._closeModalCallback;
        }

        const styleScheme = this.props?.style ?? ThemeService.getStyleScheme();

        return (
            <div
                className={
                    MODAL_CONTAINER_CLASS_NAME
                    + ' ' + (this.props.className ?? '')
                    + ` ${MODAL_CONTAINER_CLASS_NAME}-style-${stringifyStyleScheme(styleScheme)}`
                    + ' ' + MODAL_CONTAINER_CLASS_NAME + '-type-' + (stringifyModalType(type))
                    + ' ' + MODAL_CONTAINER_CLASS_NAME + '-overlay-' + (hasOverlay ? 'enabled' : 'disabled')
                }
                {...containerProps}
            >
                <div className={MODAL_CONTAINER_CLASS_NAME + '-content'}
                     onClick={this._modalClickCallback}
                >{component}</div>
            </div>
        );

    }


    private _onCloseModal () {

        if (this.props?.close) {

            try {
                this.props.close(this.props.modal);
            } catch (err) {
                LOG.error(`_onCloseModal: Could not close modal: `, err);
            }

        } else {

            const modal = this.props.modal;
            if (modal !== undefined) {
                LOG.debug(`_onCloseModal: closing modal: modal =`, modal);
                ModalService.removeModal(modal);
            } else {
                LOG.debug(`_onCloseModal: no modal detected`);
            }

        }

    }

    private _onModalClick (event : MouseEvent<HTMLDivElement>) {

        if (event) {
            LOG.debug(`_modalClickCallback: default click action cancelled`);
            event.stopPropagation();
            event.preventDefault();
        } else {
            LOG.debug(`_modalClickCallback: click detected`);
        }

    }

}


