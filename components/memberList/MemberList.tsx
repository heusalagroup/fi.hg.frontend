import { Component } from "react";
import { UserInterfaceClassName } from "../constants/UserInterfaceClassName";
import { RepositoryMember } from "../../../core/simpleRepository/types/RepositoryMember";
import { map } from "../../../core/modules/lodash";
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
                <div className={UserInterfaceClassName.MEMBER_LIST + ' ' + (this.props.className ?? '')}>
                    No members.
                </div>
            );
        }

        return (
            <div className={UserInterfaceClassName.MEMBER_LIST + ' ' + (this.props.className ?? '')}>{
                map(list, (item : RepositoryMember, index: number) : any => {
                    const id = item.id;
                    const displayName = item?.displayName ?? id;
                    return (
                        <div key={`member-${id}`}
                             className={
                                 UserInterfaceClassName.MEMBER_LIST + '-member'
                                 + ' ' + UserInterfaceClassName.MEMBER_LIST + `-member-${ index %2 === 1 ? 'even' : 'odd' }`
                             }
                        >
                            <div className={UserInterfaceClassName.MEMBER_LIST + '-member-name'}>{displayName}</div>
                            <div className={UserInterfaceClassName.MEMBER_LIST + '-member-id'}>{id}</div>
                        </div>
                    );
                })
            }</div>
        );

    }

}


