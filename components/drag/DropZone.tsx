// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    DragEvent,
    ReactNode, useCallback,
    useRef,
    useState
} from 'react';
import { LogService } from "../../../core/LogService";
import { DropEffect } from "./DragManager";
import { DropCallback } from "../../../core/interfaces/callbacks";
import { DROP_ZONE_CLASS_NAME } from "../../constants/hgClassName";
import './DropZone.scss';
import { isArray } from "../../../core/types/Array";

const LOG = LogService.createLogger('DropZone');

export interface DropZoneProps {
    readonly className?: string;
    readonly children?: ReactNode;
    readonly onDrop?: DropCallback<any>;
}

export function DropZone (props: DropZoneProps) {

    const className = props?.className;
    const children = props?.children;
    const onDrop = props?.onDrop;

    const [ isOver, setIsOver ] = useState<boolean>(false);
    const ref = useRef(null);

    const onDropCallback = useCallback(
        (ev: DragEvent<HTMLDivElement>) => {
            LOG.debug('on drop');
            ev.preventDefault();
            ev.dataTransfer.dropEffect = DropEffect.MOVE;
            const id = ev.dataTransfer.getData("text/plain");
            let data = JSON.parse(ev.dataTransfer.getData("application/json"));
            setIsOver(false);
            if ( onDrop ) {
                try {
                    if ( isArray(data) ) {
                        onDrop(id, ...data);
                    } else {
                        onDrop(id, data);
                    }
                } catch (err) {
                    LOG.error('Error while executing onDrop prop: ', err);
                }
            }
        },
        [
            onDrop
        ]
    );

    const onDragOverCallback = useCallback(
        (ev: DragEvent<HTMLDivElement>) => {
            LOG.debug('on drag over');
            ev.preventDefault();
            setIsOver(true);
        },
        [
            setIsOver
        ]
    );

    const onDragEnterCallback = useCallback(
        (ev: DragEvent<HTMLDivElement>) => {
            LOG.debug('on drag enter');
            ev.preventDefault();
            setIsOver(true);
        },
        [
            setIsOver
        ]
    );

    const onDragLeaveCallback = useCallback(
        (ev: DragEvent<HTMLDivElement>) => {
            LOG.debug('on drag leave');
            ev.preventDefault();
            setIsOver(false);
        },
        [
            setIsOver
        ]
    );

    return (
        <div
            ref={ref}
            className={
                DROP_ZONE_CLASS_NAME
                + " " + DROP_ZONE_CLASS_NAME + (isOver ? '-is-over' : '-not-over')
                + (className ? ` ${className}` : '')
            }
            onDrop={onDropCallback}
            onDragOver={onDragOverCallback}
            onDragEnter={onDragEnterCallback}
            onDragLeave={onDragLeaveCallback}
        >{children}</div>
    );

}


