// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Icon } from "../icon/Icon";
import { stringifyStyleScheme, StyleScheme } from "../../types/StyleScheme";
import { ThemeService } from "../../services/ThemeService";
import { ButtonStyle } from "../../../core/frontend/button/ButtonStyle";
import { BUTTON_CLASS_NAME, EXTERNAL_LINK_BUTTON_CLASS_NAME } from "../../constants/hgClassName";
import { ReactNode } from "react";
import "./ExternalLinkButton.scss";

export interface ExternalLinkButtonProps {
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

export function ExternalLinkButton (props: ExternalLinkButtonProps) {
    const className   = props?.className;
    const to          = props?.to;
    const MyIcon      = props?.icon;
    const label       = props?.label;
    const target      = props?.target     ?? "_blank";
    const rel         = props?.rel        ?? "noreferrer";
    const buttonStyle = props?.style      ?? ButtonStyle.SECONDARY;
    const styleScheme = props?.themeStyle ?? ThemeService.getStyleScheme();
    return (
        <a
          href={to}
          className={
              EXTERNAL_LINK_BUTTON_CLASS_NAME
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
        </a>
    );
}
