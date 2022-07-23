// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Component } from 'react';
import { UserInterfaceClassName } from "../constants/UserInterfaceClassName";
import {SelectFieldItem} from "../../types/items/SelectFieldModel";
import { Button } from "../button/Button";
import {map} from "../../../core/modules/lodash";
import {ChangeCallback} from "../../../core/interfaces/callbacks";
import { LogService } from "../../../core/LogService";
import './Tab.scss';

const LOG = LogService.createLogger('Tab');

export interface TabProps {

    readonly children  ?: any;
    readonly className ?: string;
    readonly value      : any;
    readonly values     : SelectFieldItem<any>[];
    readonly change    ?: ChangeCallback<any>;

}

export interface TabState {

}

export class Tab extends Component<TabProps, TabState> {

    static defaultProps : Partial<TabProps> = {
    };

    constructor (props: TabProps) {

        super(props);

        this.state = {};

    }

    public render () {

        return (
            <div className={
                UserInterfaceClassName.TAB +
                ' ' + (this.props.className ?? '')
            }>
                {map(this.props.values, (item : SelectFieldItem<any>, tabIndex: number) => {
                    const tabClickCallback = () => this._onTabClick(tabIndex);
                    return (
                        <Button
                            className={
                                UserInterfaceClassName.TAB + '-item'
                                + ((this.props.value === item.value) ? ' ' + UserInterfaceClassName.TAB + '-item-selected' : '')
                            }
                            click={tabClickCallback}
                        >{item.label}</Button>
                    );
                })}
                {this.props.children}
            </div>
        );

    }

    private _onTabClick (tabIndex: number) {

        const values = this.props.values;

        if (tabIndex < values.length) {

            const tabItem : SelectFieldItem<any> = values[tabIndex];

            const changeCallback = this.props?.change;
            if (changeCallback) {
                try {
                    changeCallback(tabItem.value);
                } catch (err) {
                    LOG.error('Error while executing change prop: ', err);
                }
            } else {
                LOG.warn('No change prop defined');
            }

        } else {
            LOG.error('Could not change tab: no such index as ' + tabIndex);
        }

    }

}


