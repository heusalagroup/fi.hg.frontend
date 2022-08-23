// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode } from "react";
import {
    endsWith,
    filter,
    find,
    has, isString,
    keys,
    map,
    startsWith
} from "../../../core/modules/lodash";
import { TFunction } from "react-i18next";

export interface ComponentNodeMap {
    readonly [key: string]: ReactNode;
}

export class ComponentUtils {

    public static splitWithLineBreaks (content: string) : ReactNode {
        const blocks = content.split('\n');
        return (
            <>{map(blocks, (block: string, index: number) : ReactNode => {
                return (
                    <span key={`line-${index}`}>
                        { index !== 0 ? <br /> : null }
                        {block}
                    </span>
                );
            })}</>
        )

    }

    public static prepareParagraphNodes (
        t: TFunction,
        description: readonly any[] | undefined,
        paramBlocks: ComponentNodeMap | undefined
    ) {
        return (
            <>
                {description
                    ? map(description, (paragraph: string | ReactNode, i: number) => {

                        if ( !isString(paragraph) ) {
                            return (
                                <p key={`paragraph-${i}`}>{paragraph}</p>
                            );
                        }

                        if ( paramBlocks ) {
                            return (
                                <p key={`paragraph-${i}`}>{
                                    ComponentUtils.prepareNodesFromString(
                                        t(paragraph),
                                        paramBlocks,
                                        t
                                    )
                                }</p>
                            );
                        }

                        return (
                            <p key={`paragraph-${i}`}>{t(paragraph)}</p>
                        );

                    })
                    : null}
            </>
        );
    }

    /**
     * Replaces matching blocks from inputString.
     *
     * @param t
     * @param inputString
     * @param blocks
     * @param translationParams
     */
    public static prepareNodesFromString (
        inputString: string,
        blocks: ComponentNodeMap,
        t: TFunction,
        translationParams: {readonly [key: string]: any} = {}
    ): ReactNode[] {

        const startTag: string = '[[';
        const endTag: string = ']]';

        let input: string = inputString;

        if ( input.length === 0 ) return [];

        const blockKeywords: string[] = map(keys(blocks), (k) => `${startTag}${k}${endTag}`);
        if ( blockKeywords.length === 0 ) {
            return [ input ];
        }

        const itemsFound: ReactNode[] = [];

        const createIndexPairFunc = (str: string) => {
            return (k: string): [ string, number ] => [ k, str.indexOf(k) ];
        };

        do {

            const indexPairs = map(blockKeywords, createIndexPairFunc(input));
            const indexes = map(indexPairs, (item: [ string, number ]): number => item[1]);
            const index = ComponentUtils._findSmallestIndex(indexes);
            if ( index < 0 ) break;

            const foundPair: [ string, number ] | undefined = find(indexPairs, (item: [ string, number ]): boolean => item[1] === index);
            const foundKeyword: string | undefined = foundPair ? foundPair[0] : undefined;
            if ( foundKeyword === undefined ) throw new TypeError(`Could not find matching key for index ${index}`);
            const foundBlockKey: string = startsWith(foundKeyword, startTag) && endsWith(foundKeyword, endTag) ? foundKeyword.substring(startTag.length, foundKeyword.length - endTag.length) : '';
            if ( !has(blocks, foundBlockKey) ) throw new TypeError(`Could not find matching block for index ${index} and key ${foundBlockKey} from tag ${foundKeyword}`);

            if ( index !== 0 ) {
                itemsFound.push(<>{t(input.substring(0, index), translationParams)}</>);
                input = input.substring(index);
            }

            itemsFound.push(blocks[foundBlockKey]);
            input = input.substring(foundKeyword.length);

        } while ( true );

        if ( input.length ) {
            itemsFound.push(<>{t(input, translationParams)}</>);
        }

        return itemsFound;

    }

    private static _findSmallestIndex (
        indexes: number[]
    ): number {
        indexes = filter(indexes, (i: number): boolean => i >= 0);
        indexes.sort((a: number, b: number) => a - b);
        return indexes.shift() ?? -1;
    }

}
