// Copyright (c) 2020-2021 Sendanor. All rights reserved.

import { Component } from "react";
import { ReactComponent as LoadingIcon } from "./loading.svg";
import "./Loader.scss";
import { LOADER_CLASS_NAME } from "../../constants/hgClassName";

export interface LoaderProps {

    readonly className?: string;
    readonly speed?: number;

    /**
     * Time in milliseconds until the loader will be displayed to the user
     */
    readonly hiddenTime?: number;

}

export interface LoaderState {
    readonly hidden: boolean;
}

/**
 * Loader component.
 */
export class Loader extends Component<LoaderProps, LoaderState> {

    static defaultProps : Partial<LoaderProps> = {
        speed: 1.6,
        hiddenTime: 500
    };

    private hiddenTimeout : any;

    constructor(props : LoaderProps) {

        super(props);

        this.state = {
            hidden: (this.props.hiddenTime ?? -1) >= 0
        };

        this.hiddenTimeout = undefined;

    }

    componentDidMount() {

        const hiddenTime = this.props.hiddenTime ?? -1;

        if (hiddenTime >= 0) {

            this.hiddenTimeout = setTimeout(() => {

                this.hiddenTimeout = undefined;

                this.setState({
                    hidden: false
                });

            }, hiddenTime);

        }

    }

    componentWillUnmount() {

        if (this.hiddenTimeout !== undefined) {
            clearTimeout(this.hiddenTimeout);
            this.hiddenTimeout = undefined;
        }

    }

    render () {

        const loadingIcon = this.state.hidden ? '' : <LoadingIcon />;

        return (
            <div className={ LOADER_CLASS_NAME + ' ' + (this.props.className ?? '')}>
                <div className={LOADER_CLASS_NAME + '-icon-container'}
                     style={{animation: `spin ${this.props.speed}s linear infinite`}}
                >{loadingIcon}</div>
            </div>
        );

    }

}


