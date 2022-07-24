// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { RepositoryMember } from "../../../core/simpleRepository/types/RepositoryMember";
import { map } from "../../../core/modules/lodash";
import { MEMBER_LIST_CLASS_NAME } from "../../constants/hgClassName";
import { TranslationFunction } from "../../../core/types/TranslationFunction";
import "./MemberList.scss";

export interface MemberListProps {
    readonly t               : TranslationFunction;
    readonly className      ?: string;
    readonly list            : RepositoryMember[];
    readonly noMembersLabel  : string;
}

export function MemberList (props: MemberListProps) {
    const className = props?.className;
    const t = props?.t;
    const list : RepositoryMember[] = props?.list ?? [];
    const noMembersLabel : string = props?.noMembersLabel ?? 'fi.hg.membersList.noMembers'
    return (
        <div className={MEMBER_LIST_CLASS_NAME + (className ? ` ${className}`: '')}>{
            list.length === 0 ? (
                t(noMembersLabel)
            ) : (
                map(list, (item : RepositoryMember, index: number) : any => {
                    const id = item.id;
                    const displayName = item?.displayName ?? id;
                    return (
                        <div key={`member-list-item-${id}`}
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
            )
        }</div>
    );
}
