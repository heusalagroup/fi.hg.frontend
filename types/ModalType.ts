// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum ModalType {
    CENTER,
    TOP,
    RIGHT,
    BOTTOM,
    LEFT
}

export function isModalType (value: any): value is ModalType {
    switch (value) {

        case ModalType.CENTER:
        case ModalType.TOP:
        case ModalType.RIGHT:
        case ModalType.BOTTOM:
        case ModalType.LEFT:
            return true;

        default:
            return false;

    }
}

export function stringifyModalType (value: ModalType): string {
    switch (value) {
        case ModalType.CENTER : return 'CENTER';
        case ModalType.TOP    : return 'TOP';
        case ModalType.RIGHT  : return 'RIGHT';
        case ModalType.BOTTOM : return 'BOTTOM';
        case ModalType.LEFT   : return 'LEFT';
    }
    throw new TypeError(`Unsupported ModalType value: ${value}`);
}

export function parseModalType (value: any): ModalType | undefined {

    switch (value) {
        case 'CENTER' : return ModalType.CENTER;
        case 'TOP'    : return ModalType.TOP;
        case 'RIGHT'  : return ModalType.RIGHT;
        case 'BOTTOM' : return ModalType.BOTTOM;
        case 'LEFT'   : return ModalType.LEFT;
        default       : return undefined;
    }

}


