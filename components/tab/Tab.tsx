// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { Component } from 'react';
import {SelectFieldItem} from "../../types/items/SelectFieldModel";
import { Button } from "../button/Button";
import {map} from "../../../core/modules/lodash";
import {ChangeCallback} from "../../../core/interfaces/callbacks";
import { LogService } from "../../../core/LogService";
import { TAB_CLASS_NAME } from "../../constants/hgClassName";
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
                TAB_CLASS_NAME +
                ' ' + (this.props.className ?? '')
            }>
                {map(this.props.values, (item : SelectFieldItem<any>, tabIndex: number) => {
                    const tabClickCallback = () => this._onTabClick(tabIndex);
                    return (
                        <Button
                            className={
                                TAB_CLASS_NAME + '-item'
                                + ((this.props.value === item.value) ? ' ' + TAB_CLASS_NAME + '-item-selected' : '')
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


