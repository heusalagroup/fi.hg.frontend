// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Component } from 'react';
import './Icon.scss';
import { ICON_CLASS_NAME } from "../../constants/hgClassName";

export enum IconType {
    DEFAULT,
    CIRCLE
}

export interface IconProps {
    readonly className?: string;
    readonly type?: IconType;
}

export interface IconState {

}

export class Icon extends Component<IconProps, IconState> {

    static Type = IconType;

    static defaultProps : IconProps = {
        className: undefined,
        type: IconType.DEFAULT
    };

    constructor (props: IconProps) {

        super(props);

        this.state = {};

    }

    public render () {

        return <div className={
            ICON_CLASS_NAME +
            ' ' + (this.props.className ?? '') +
            ' ' + Icon.getTypeClassName(this.props.type)
        }>{this.props.children}</div>;

    }

    static getTypeClassName (type : (IconType|undefined)) : string {
        switch (type) {
            case IconType.DEFAULT : return ICON_CLASS_NAME + '-type-default';
            case IconType.CIRCLE  : return ICON_CLASS_NAME + '-type-circle';
            default:                return '';
        }
    }

}


