// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Component } from "react";
import { Icon } from "../../icon/Icon";
import { Link } from "react-router-dom";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import { ThemeService } from "../../../services/ThemeService";
import { UserInterfaceClassName } from "../../constants/UserInterfaceClassName";
import { ButtonStyle } from "../../button/types/ButtonStyle";
import "./LinkButton.scss";

export interface LinkButtonProps {
    readonly className   ?: string;
    readonly to           : string;
    readonly icon        ?: any;
    readonly label       ?: string;
    readonly themeStyle  ?: StyleScheme;
    readonly style       ?: ButtonStyle;
    readonly target      ?: string;
    readonly rel         ?: string;
}

export interface LinkButtonState {
}

export class LinkButton extends Component<LinkButtonProps, LinkButtonState> {

    public static defaultProps: Partial<LinkButtonProps> = {};

    public constructor (props: LinkButtonProps) {
        super(props);
    }

    public render () {

        const MyIcon      = this.props?.icon;
        const label       = this.props?.label;
        const buttonStyle = this.props?.style      ?? ButtonStyle.SECONDARY;
        const styleScheme = this.props?.themeStyle ?? ThemeService.getStyleScheme();

        return (
            <Link to={this.props.to}
                  className={
                      UserInterfaceClassName.LINK_BUTTON
                      + ` ${UserInterfaceClassName.BUTTON}`
                      + ` ${UserInterfaceClassName.BUTTON}-${buttonStyle}`
                      + ` ${UserInterfaceClassName.BUTTON}-style-${stringifyStyleScheme(styleScheme)}`
                      + ' ' + (this.props.className ?? '')
                  }
                  target={ this.props.target ?? "_blank" }
                  rel={ this.props.rel ?? "noreferrer" }
            >
                {MyIcon ? (
                    <Icon className={`${UserInterfaceClassName.BUTTON}-icon`}><MyIcon /></Icon>
                ): null}
                {label ? (
                    <span className={`${UserInterfaceClassName.BUTTON}-text`}>{label}</span>
                ): null}
                {this.props.children}
            </Link>
        );

    }

}


