// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Component } from "react";
import { RepositoryMember } from "../../../core/simpleRepository/types/RepositoryMember";
import { map } from "../../../core/modules/lodash";
import { MEMBER_LIST_CLASS_NAME } from "../../constants/hgClassName";
import "./MemberList.scss";

export interface MemberListProps {
    readonly className ?: string;
    readonly list       : RepositoryMember[];
}

export interface MemberListState {
}

export class MemberList extends Component<MemberListProps, MemberListState> {

    public static defaultProps: Partial<MemberListProps> = {};

    public constructor (props: MemberListProps) {
        super(props);
    }

    public render () {

        const list : RepositoryMember[] = this.props?.list ?? [];

        if (list.length === 0) {
            return (
                <div className={MEMBER_LIST_CLASS_NAME + ' ' + (this.props.className ?? '')}>
                    No members.
                </div>
            );
        }

        return (
            <div className={MEMBER_LIST_CLASS_NAME + ' ' + (this.props.className ?? '')}>{
                map(list, (item : RepositoryMember, index: number) : any => {
                    const id = item.id;
                    const displayName = item?.displayName ?? id;
                    return (
                        <div key={`member-${id}`}
                             className={
                                 MEMBER_LIST_CLASS_NAME + '-member'
                                 + ' ' + MEMBER_LIST_CLASS_NAME + `-member-${ index %2 === 1 ? 'even' : 'odd' }`
                             }
                        >
                            <div className={MEMBER_LIST_CLASS_NAME + '-member-name'}>{displayName}</div>
                            <div className={MEMBER_LIST_CLASS_NAME + '-member-id'}>{id}</div>
                        </div>
                    );
                })
            }</div>
        );

    }

}


