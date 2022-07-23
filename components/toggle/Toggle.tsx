// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Component, MouseEvent } from "react";
import { ToggleOffIcon, ToggleOnIcon } from "./assets";
import { LogService } from "../../../core/LogService";
import { UserInterfaceClassName } from "../constants/UserInterfaceClassName";
import "./Toggle.scss";

const LOG = LogService.createLogger('Toggle');

export interface ToggleChangeCallback {
    (value: boolean) : void;
}

export interface ToggleProps {
    readonly className ?: string;
    readonly value      : boolean;
    readonly change    ?: ToggleChangeCallback;
}

export interface ToggleState {
}

export class Toggle extends Component<ToggleProps, ToggleState> {

    private readonly _clickCallback : (e: MouseEvent<HTMLDivElement>) => void;

    public static defaultProps: Partial<ToggleProps> = {};

    public constructor (props: ToggleProps) {
        super(props);
        this._clickCallback = this._onClick.bind(this);
    }

    public render () {

        const value = this.props.value;
        const Icon = value ? ToggleOnIcon : ToggleOffIcon;

        return (
            <div className={
                UserInterfaceClassName.TOGGLE
                + ' ' + (this.props.className ?? '')
                + ' ' + UserInterfaceClassName.TOGGLE + (value ? '-enabled' : '-disabled')
            }
            onClick={this._clickCallback}
            ><Icon /></div>
        );

    }

    private _onClick (e: MouseEvent<HTMLDivElement>) {

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const value = !this.props.value;
        if (this.props.change) {
            try {
                this.props.change(value);
            } catch (err) {
                LOG.error(`Error on click handler: `, err);
            }
        } else {
            LOG.warn(`Warning! No click handler defined!`);
        }

    }

}


