// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Component } from "react";
import { Modal } from "../../types/Modal";
import { ModalService,
    ModalEventCallback,
    ModalServiceDestructor,
    ModalServiceEvent
} from "../../services/ModalService";
import { LogService } from "../../../core/LogService";
import { map } from "../../../core/modules/lodash";
import { ModalContainer } from "./ModalContainer";
import { ChangeCallback } from "../../../core/interfaces/callbacks";
import { MODAL_GROUP_CONTAINER_CLASS_NAME } from "../../constants/hgClassName";
import "./ModalGroupContainer.scss";

const LOG = LogService.createLogger('ModalGroupContainer');

export interface ModalGroupContainerProps {
    readonly className?: string;
}

export interface ModalGroupContainerState {
    readonly modals: readonly Modal[];
}

export class ModalGroupContainer extends Component<ModalGroupContainerProps, ModalGroupContainerState> {

    public static defaultProps: Partial<ModalGroupContainerProps> = {};

    private readonly _currentModalChangedCallback  : ModalEventCallback;
    private readonly _closeCallback               ?: ChangeCallback<Modal>;

    private _modalCreatedListener : ModalServiceDestructor | undefined;
    private _modalRemovedListener : ModalServiceDestructor | undefined;


    public constructor (props: ModalGroupContainerProps) {

        super(props);

        this.state = {
            modals: []
        };

        this._modalCreatedListener        = undefined;
        this._currentModalChangedCallback = this._onCurrentModalChange.bind(this);
        this._closeCallback               = this._onModalClose.bind(this);

    }

    public componentDidMount (): void {

        LOG.debug(`_onCurrentModalChange: updating state`);
        this._updateState();

        LOG.debug(`_onCurrentModalChange: listening state changes`);
        this._modalCreatedListener = ModalService.on(ModalServiceEvent.MODAL_CREATED, this._currentModalChangedCallback);
        this._modalRemovedListener = ModalService.on(ModalServiceEvent.MODAL_REMOVED, this._currentModalChangedCallback);

    }

    public componentWillUnmount (): void {

        if (this._modalCreatedListener) {
            LOG.debug(`componentWillUnmount: Closing listener for modal created`);
            this._modalCreatedListener();
            this._modalCreatedListener = undefined;
        }

        if (this._modalRemovedListener) {
            LOG.debug(`componentWillUnmount: Closing listener for modal removed`);
            this._modalRemovedListener();
            this._modalRemovedListener = undefined;
        }

    }

    public render () {

        const modals = this.state.modals;
        if (modals.length === 0) {
            LOG.debug(`render: No modal detected`);
            return null;
        }
        LOG.debug(`render: modals =`, modals);

        return (
            <div className={
                MODAL_GROUP_CONTAINER_CLASS_NAME
                + ' ' + (this.props.className ?? '')
            }
            >{map(modals, (item : Modal, itemIndex: number) => {
                const itemId = item.getId();
                return (
                    <ModalContainer
                        key={`modal-${itemId}`}
                        className={MODAL_GROUP_CONTAINER_CLASS_NAME + '-item'}
                        modal={item}
                        close={this._closeCallback}
                    />
                );
            })}</div>
        );

    }


    private _onCurrentModalChange () {

        LOG.debug(`_onCurrentModalChange: updating state`);
        this._updateState();

    }

    private _updateState () {

        const modals = ModalService.getAllModals();
        LOG.debug(`_updateState: setting state as: modals =`, modals);
        this.setState({modals: modals});

    }

    private _onModalClose (modal: Modal) {

        if (modal !== undefined) {
            LOG.debug(`_onCloseModal: closing modal: modal =`, modal);
            ModalService.removeModal(modal);
        } else {
            LOG.debug(`_onCloseModal: no modal detected`);
        }

    }

}


