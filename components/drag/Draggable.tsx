// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Component, createRef, RefObject} from 'react';
import { UserInterfaceClassName } from "../constants/UserInterfaceClassName";
import { DraggableElementManager } from "./DragManager";
import { LogService } from "../../../core/LogService";
import './Draggable.scss';

const LOG = LogService.createLogger('Draggable');

export interface DraggableState {
}

export interface DraggableClickCallback {
    () : void;
}

export interface DraggableProps {

    readonly id : string;

    readonly data ?: any[];

}

export class Draggable extends Component<DraggableProps, DraggableState> {

    private readonly _ref : RefObject<HTMLDivElement>;
    private _manager : DraggableElementManager<HTMLDivElement> | undefined;

    constructor (props: DraggableProps) {

        super(props);

        this.state = {};

        this._manager = undefined;
        this._ref =
            createRef<HTMLDivElement>();

    }

    componentDidMount() {

        if (this._ref.current && this.props.id) {

            this._manager = new DraggableElementManager<HTMLDivElement>(this.props.id, this._ref.current);

            if (this.props.data) {
                this._manager.setDropData(this.props.data);
            }

        } else {
            LOG.warn('Warning! No reference to the DOM element or id: ', this._ref.current, this.props.id);
        }


    }

    componentDidUpdate(prevProps: Readonly<DraggableProps>, prevState: Readonly<DraggableState>, snapshot?: any) {

        if (this._manager) {
            if (prevProps.data !== this.props.data) {
                if (this.props.data) {
                    this._manager.setDropData(this.props.data);
                } else {
                    this._manager.setDropData([]);
                }
            }
        } else {
            LOG.warn('Warning! No manager exists yet.');
        }

    }

    componentWillUnmount() {

        if (this._manager) {
            this._manager.destroy();
            this._manager = undefined;
        }

    }

    render () {

        return (
            <div
                ref={this._ref}
                className={UserInterfaceClassName.DRAGGABLE}
                draggable="true"
            >{this.props.children}</div>
        );

    }

}


