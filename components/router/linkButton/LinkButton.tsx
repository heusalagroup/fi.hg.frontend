// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Icon } from "../../icon/Icon";
import { Link } from "react-router-dom";
import { stringifyStyleScheme, StyleScheme } from "../../../types/StyleScheme";
import { ThemeService } from "../../../services/ThemeService";
import { ButtonStyle } from "../../../../core/frontend/button/ButtonStyle";
import { BUTTON_CLASS_NAME, LINK_BUTTON_CLASS_NAME } from "../../../constants/hgClassName";
import { ReactNode } from "react";
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
    readonly children    ?: ReactNode;
}

export function LinkButton (props: LinkButtonProps) {
    const className   = props?.className;
    const to          = props?.to;
    const MyIcon      = props?.icon;
    const label       = props?.label;
    const target      = props?.target     ?? "_blank";
    const rel         = props?.rel        ?? "noreferrer";
    const buttonStyle = props?.style      ?? ButtonStyle.SECONDARY;
    const styleScheme = props?.themeStyle ?? ThemeService.getStyleScheme();
    return (
        <Link to={to}
              className={
                  LINK_BUTTON_CLASS_NAME
                  + ` ${BUTTON_CLASS_NAME}`
                  + ` ${BUTTON_CLASS_NAME}-${buttonStyle}`
                  + ` ${BUTTON_CLASS_NAME}-style-${stringifyStyleScheme(styleScheme)}`
                  + (className? ` ${className}` : '')
              }
              target={ target }
              rel={ rel }
        >
            {MyIcon ? (
                <Icon className={`${BUTTON_CLASS_NAME}-icon`}><MyIcon /></Icon>
            ): null}
            {label ? (
                <span className={`${BUTTON_CLASS_NAME}-text`}>{label}</span>
            ): null}
            {props?.children}
        </Link>
    );
}
