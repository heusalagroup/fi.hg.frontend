// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { SelectFieldItem } from "../../types/items/SelectFieldModel";
import { Button } from "../button/Button";
import { map } from "../../../core/functions/map";
import { ChangeCallback } from "../../../core/interfaces/callbacks";
import { LogService } from "../../../core/LogService";
import { TAB_CLASS_NAME } from "../../constants/hgClassName";
import { ReactNode, useCallback } from "react";
import './Tab.scss';
import { useFieldChangeCallback } from "../../hooks/field/useFieldChangeCallback";

const LOG = LogService.createLogger('Tab');

export interface TabProps {
    readonly className?: string;
    readonly value: any;
    readonly values: SelectFieldItem<any>[];
    readonly change?: ChangeCallback<any>;
    readonly children?: ReactNode;
}

export function Tab (props: TabProps) {

    const className = props?.className;
    const propsValues = props?.values;
    const propsChange = props?.change;

    const changeCallback = useFieldChangeCallback<any>(
        'Tab',
        propsChange
    );

    const onTabClickCallback = useCallback(
        (tabIndex: number) => {
            if ( tabIndex < propsValues.length ) {
                const tabItem: SelectFieldItem<any> = propsValues[tabIndex];
                changeCallback(tabItem.value);
            } else {
                LOG.error('Could not change tab: no such index as ' + tabIndex);
            }
        },
        [
            propsValues,
            changeCallback
        ]
    );

    return (
        <div
            className={
                TAB_CLASS_NAME +
                +(className ? ` ${className}` : '')
            }
        >

            {map(propsValues, (item: SelectFieldItem<any>, tabIndex: number) => {
                return (
                    <Button
                        className={
                            TAB_CLASS_NAME + '-item'
                            + ((propsValues === item.value) ? ' ' + TAB_CLASS_NAME + '-item-selected' : '')
                        }
                        click={() => onTabClickCallback(tabIndex)}
                    >{item.label}</Button>
                );
            })}

            {props?.children}

        </div>
    );

}

