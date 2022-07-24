// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    ReactNode,
    RefObject,
    useEffect,
    useRef
} from 'react';
import { DraggableElementManager } from "./DragManager";
import { LogService } from "../../../core/LogService";
import { DRAGGABLE_CLASS_NAME } from "../../constants/hgClassName";
import './Draggable.scss';

const LOG = LogService.createLogger('Draggable');

export interface DraggableClickCallback {
    (): void;
}

export interface DraggableProps {
    readonly id: string;
    readonly data?: any[];
}

export interface DraggableProps {
    readonly className?: string;
    readonly id: string;
    readonly data?: any[];
    readonly children?: ReactNode;
}

export function useDraggableElementManager (
    ref   : RefObject<HTMLDivElement>,
    id    : string,
    data ?: any[]
) : void {

    let manager : DraggableElementManager<HTMLDivElement> | undefined = undefined;

    useEffect(
        () => {

            if (!manager) {
                if ( ref.current && id ) {
                    manager = new DraggableElementManager<HTMLDivElement>(id, ref.current);
                    if ( data ) {
                        manager.setDropData(data);
                    }
                } else {
                    LOG.warn('Warning! No reference to the DOM element or id: ', ref.current, id);
                }
            } else if ( data ) {
                manager.setDropData(data);
            } else {
                manager.setDropData([]);
            }

            return () => {
                if ( manager ) {
                    manager.destroy();
                    manager = undefined;
                }
            };

        },
        [
            data
        ]
    );

}

export function Draggable (props: DraggableProps) {
    const className = props?.className;
    const id = props?.id;
    const data = props?.data;
    const ref = useRef<HTMLDivElement>(null);
    useDraggableElementManager(ref, id, data);
    return (
        <div
            ref={ref}
            className={DRAGGABLE_CLASS_NAME + (className ? ` ${className}` : '')}
            draggable="true"
        >{props?.children}</div>
    );
}

