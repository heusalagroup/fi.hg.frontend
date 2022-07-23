// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Component, createRef, DragEvent, RefObject } from 'react';
import { UserInterfaceClassName } from "../constants/UserInterfaceClassName";
import { LogService } from "../../../core/LogService";
import { DropEffect } from "./DragManager";
import { DropCallback, EventCallback } from "../../../core/interfaces/callbacks";
import { isArray } from "../../../core/modules/lodash";
import './DropZone.scss';

const LOG = LogService.createLogger('DropZone');

export interface DropZoneState {
    isOver : boolean;
}

export interface DropZoneProps {

    readonly onDrop ?: DropCallback<any>;

}

export class DropZone extends Component<DropZoneProps, DropZoneState> {

    private readonly _ref                : RefObject<HTMLDivElement>;
    private readonly _onDropCallback     : EventCallback<DragEvent<HTMLDivElement>>;
    private readonly _onDragOverCallback : EventCallback<DragEvent<HTMLDivElement>>;
    private readonly _onDragEnterCallback : EventCallback<DragEvent<HTMLDivElement>>;
    private readonly _onDragLeaveCallback : EventCallback<DragEvent<HTMLDivElement>>;

    constructor (props: DropZoneProps) {

        super(props);

        this.state = {
            isOver: false
        };

        this._ref = createRef<HTMLDivElement>();

        this._onDropCallback     = this._onDrop.bind(this);
        this._onDragOverCallback = this._onDragOver.bind(this);
        this._onDragEnterCallback = this._onDragEnter.bind(this);
        this._onDragLeaveCallback = this._onDragLeave.bind(this);

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render () {

        const isOver = this.state.isOver;

        // LOG.debug('render: isOver is ', isOver);

        return (
            <div
                ref={this._ref}
                className={
                    UserInterfaceClassName.DROP_ZONE
                    + " " + UserInterfaceClassName.DROP_ZONE + (isOver ? '-is-over' : '-not-over')
                }
                onDrop={this._onDropCallback}
                onDragOver={this._onDragOverCallback}
                onDragEnter={this._onDragEnterCallback}
                onDragLeave={this._onDragLeaveCallback}
            >{this.props.children}</div>
        );

    }

    private _onDrop (ev : DragEvent<HTMLDivElement>) {

        LOG.debug('on drop');

        ev.preventDefault();

        ev.dataTransfer.dropEffect = DropEffect.MOVE;

        const id = ev.dataTransfer.getData("text/plain");

        let data = JSON.parse(ev.dataTransfer.getData("application/json"));

        this._setIsOver(false);

        if (this.props.onDrop) {
            try {
                if (isArray(data)) {
                    this.props.onDrop(id, ...data);
                } else {
                    this.props.onDrop(id, data);
                }
            } catch (err) {
                LOG.error('Error while executing onDrop prop: ', err);
            }
        }

    }

    private _onDragOver (ev : DragEvent<HTMLDivElement>) {

        LOG.debug('on drag over');

        ev.preventDefault();

        this._setIsOver(true);

        // const data = ev.dataTransfer.getData('text/plain');
        // ev.target.appendChild(document.getElementById(data));

    }

    private _onDragEnter (ev : DragEvent<HTMLDivElement>) {

        LOG.debug('on drag enter');

        ev.preventDefault();

        this._setIsOver(true);

    }

    private _onDragLeave (ev : DragEvent<HTMLDivElement>) {

        LOG.debug('on drag leave');

        ev.preventDefault();

        this._setIsOver(false);

    }

    private _setIsOver (value: boolean) {

        if (this.state.isOver !== value) {
            LOG.debug('Setting isOver as', value);
            this.setState({
                isOver: value
            });
        }

    }

}


