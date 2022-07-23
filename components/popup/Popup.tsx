// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Component , RefObject , createRef } from 'react';
import { UserInterfaceClassName } from "../constants/UserInterfaceClassName";
import { LogService } from "../../../core/LogService";
import { createPortal } from 'react-dom';
import './Popup.scss';

const LOG = LogService.createLogger('Popup');

export enum PopupType {

    DEFAULT

}

export interface PopupProps {

    className ?: string;
    type      ?: PopupType;
    open       : boolean;

    /** Target to mount the popup on DOM (using React Portal) */
    target    ?: any;

}

enum PopupDirection {
    UNDEFINED,
    UP,
    DOWN
}

export interface PopupState {
    direction : PopupDirection,
    width     : number | undefined;
    height    : number | undefined;
}

export class Popup extends Component<PopupProps, PopupState> {

    private readonly _ref                  : RefObject<HTMLDivElement>;

    private _portal : undefined;

    static Type = PopupType;

    static defaultProps : Partial<PopupProps> = {

        type: PopupType.DEFAULT

    };

    constructor (props: PopupProps) {

        super(props);

        this.state = {
            width     : undefined,
            height    : undefined,
            direction : PopupDirection.UNDEFINED
        };

        this._portal = undefined;

        this._ref = createRef<HTMLDivElement>();

    }

    public componentDidMount() {

        this._updateDomInfo();

    }

    public componentDidUpdate(prevProps: Readonly<PopupProps>, prevState: Readonly<PopupState>, snapshot?: any) {

        this._updateDomInfo();

    }

    public render () {

        if (!this.props.open) return null;

        if (this.props.target) {
            return createPortal((
                <div className={UserInterfaceClassName.POPUP+'-window'}>{this.props.children}</div>
            ), this.props.target);
        } else {

            const styles = this.state.direction === PopupDirection.UP ? {
                left: 0,
                bottom: '4em'
            } : {
                left: 0,
                top: 0
            };

            return (
                <div
                    className={
                        UserInterfaceClassName.POPUP +
                        ' ' + (this.props.className ?? '') +
                        ' ' + Popup.getTypeClassName(this.props.type)
                    }
                    ref={this._ref}
                >
                    <div
                        className={UserInterfaceClassName.POPUP+'-window'}
                        style={styles}
                    >{this.props.children}</div>
                </div>
            );
        }

    }

    static getTypeClassName (type : (PopupType|undefined)) : string {

        switch (type) {
            case PopupType.DEFAULT : return UserInterfaceClassName.POPUP + '-type-default';
            default                : return '';
        }

    }

    private _updateDomInfo () {

        const node = this._ref?.current;

        if (!node) {
            LOG.debug('_updateDomInfo: No element yet.')
            return;
        }

        const documentWidth  : number | undefined = document?.body?.clientWidth;
        const documentHeight : number | undefined = document?.body?.clientHeight;

        LOG.debug('Document dimensions: ', documentWidth, documentHeight);

        const prevWidth     : number | undefined = this.state.width;
        const prevHeight    : number | undefined = this.state.height;
        const prevDirection : PopupDirection     = this.state.direction;

        const x  : number | undefined = node?.offsetLeft;
        const y  : number | undefined = node?.offsetTop;
        LOG.debug('Popup location: ', x, y);

        const direction : PopupDirection = (
            documentHeight !== undefined && y !== undefined
            ? (
                (y > documentHeight / 2) ? PopupDirection.UP : PopupDirection.DOWN
            ) : PopupDirection.UNDEFINED
        );

        const width  : number | undefined = node?.offsetWidth;
        const height : number | undefined = node?.offsetHeight;

        if (prevWidth !== width || prevHeight !== height || prevDirection !== direction) {
            LOG.debug('_updateDomInfo: Changes: ', width, height);
            this.setState({
                width,
                height,
                direction
            });
        } else {
            LOG.debug('_updateDomInfo: No changes: ', width, height);
        }

    }

}


