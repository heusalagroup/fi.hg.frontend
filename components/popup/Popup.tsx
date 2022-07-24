// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2020-2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    ReactNode,
    useCallback, useEffect,
    useRef,
    useState
} from 'react';
import { LogService } from "../../../core/LogService";
import { createPortal } from 'react-dom';
import { POPUP_CLASS_NAME } from "../../constants/hgClassName";
import './Popup.scss';

const LOG = LogService.createLogger('Popup');

export enum PopupType {
    DEFAULT
}

export enum PopupDirection {
    UNDEFINED,
    UP,
    DOWN
}

export interface PopupProps {

    readonly className?: string;
    readonly type?: PopupType;
    readonly open: boolean;

    /** Target to mount the popup on DOM (using React Portal) */
    readonly target?: any;

    readonly children: ReactNode;

}

export function Popup (props: PopupProps) {

    const className = props?.className;
    const propsType = props?.type ?? PopupType.DEFAULT;
    const propsOpen = props?.open;
    const propsTarget = props?.target;
    const propsChildren = props?.children;

    const [ direction, setDirection ] = useState<PopupDirection>(PopupDirection.UNDEFINED);
    const [ width, setWidth ] = useState<number | undefined>(undefined);
    const [ height, setHeight ] = useState<number | undefined>(undefined);

    const ref = useRef<HTMLDivElement>(null);

    const updateDomInfo = useCallback(
        () : void => {

            const node = ref?.current;

            if ( !node ) {
                LOG.debug('_updateDomInfo: No element yet.');
                return;
            }

            const documentWidth: number | undefined = document?.body?.clientWidth;
            const documentHeight: number | undefined = document?.body?.clientHeight;

            LOG.debug('Document dimensions: ', documentWidth, documentHeight);

            const prevWidth: number | undefined = width;
            const prevHeight: number | undefined = height;
            const prevDirection: PopupDirection = direction;

            const x: number | undefined = node?.offsetLeft;
            const y: number | undefined = node?.offsetTop;
            LOG.debug('Popup location: ', x, y);

            const currentDirection: PopupDirection = (
                documentHeight !== undefined && y !== undefined
                    ? (
                        (y > documentHeight / 2) ? PopupDirection.UP : PopupDirection.DOWN
                    ) : PopupDirection.UNDEFINED
            );

            const offsetWidth: number | undefined = node?.offsetWidth;
            const offsetHeight: number | undefined = node?.offsetHeight;

            if ( prevWidth !== offsetWidth || prevHeight !== offsetHeight || prevDirection !== currentDirection ) {
                LOG.debug('_updateDomInfo: Changes: ', offsetWidth, offsetHeight);
                setWidth(offsetWidth);
                setHeight(offsetHeight);
                setDirection(currentDirection);
            } else {
                LOG.debug('_updateDomInfo: No changes: ', offsetWidth, offsetHeight);
            }

        },
        [
            direction,
            height,
            width,
            setWidth,
            setHeight,
            setDirection
        ]
    );

    useEffect( () => {
        updateDomInfo();
    }, [
        updateDomInfo
    ] );


    if ( !propsOpen ) return null;

    if ( propsTarget ) {
        return createPortal(
            (
                <div className={POPUP_CLASS_NAME + '-window'}>{propsChildren}</div>
            ),
            propsTarget
        );
    }

    const styles = direction === PopupDirection.UP ? {
        left: 0,
        bottom: '4em'
    } : {
        left: 0,
        top: 0
    };

    return (
        <div
            className={
                POPUP_CLASS_NAME
                + (className ? ` ${className}` : '')
                + ' ' + getTypeClassName(propsType)
            }
            ref={ref}
        >
            <div
                className={POPUP_CLASS_NAME + '-window'}
                style={styles}
            >{propsChildren}</div>
        </div>
    );

}

function getTypeClassName (type: PopupType | undefined): string {
    switch (type) {
        case PopupType.DEFAULT :
            return POPUP_CLASS_NAME + '-type-default';
        default                :
            return '';
    }
}
