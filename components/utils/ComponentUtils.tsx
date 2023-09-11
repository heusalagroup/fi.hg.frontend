// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode } from "react";
import { endsWith } from "../../../core/functions/endsWith";
import { filter } from "../../../core/functions/filter";
import { find } from "../../../core/functions/find";
import { has } from "../../../core/functions/has";
import { map } from "../../../core/functions/map";
import { startsWith } from "../../../core/functions/startsWith";
import { TranslationParams } from "../../../core/types/TranslationParams";
import { TranslationFunction } from "../../../core/types/TranslationFunction";
import { isString } from "../../../core/types/String";
import { keys } from "../../../core/functions/keys";

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
        t: TranslationFunction,
        description: readonly any[] | undefined,
        paramBlocks: ComponentNodeMap | undefined,
        translationParams ?: TranslationParams
    ) : ReactNode {
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
                                        t(paragraph, translationParams),
                                        paramBlocks,
                                        t,
                                        translationParams
                                    )
                                }</p>
                            );
                        }

                        const paragraphText = t(paragraph, translationParams);

                        if (paragraphText.includes('\n\n')) {
                            const texts = paragraphText.split('\n\n');
                            return <>{map(
                                texts,
                                (text: string, subIndex:number) : any => {
                                    return (
                                        <p key={`paragraph-${i}-${subIndex}`}>{text}</p>
                                    );
                                }
                            )}</>;
                        }

                        return (
                            <p key={`paragraph-${i}`}>{paragraphText}</p>
                        );

                    })
                    : null}
            </>
        );
    }

    public static prepareParagraphNodesAsText (
        t: TranslationFunction,
        description: readonly any[] | undefined,
        paramBlocks: ComponentNodeMap | undefined,
        translationParams ?: TranslationParams
    ) : string {
        return (
            description
            ? map(description, (paragraph: string | ReactNode) : string => {

                if ( !isString(paragraph) ) {
                    if (paragraph?.toString) return paragraph.toString();
                    return '';
                }

                if ( paramBlocks ) {
                    return ComponentUtils.prepareNodeStringsFromString(
                        t(paragraph, translationParams),
                        paramBlocks,
                        t,
                        translationParams
                    ).join(' ');
                }

                return t(paragraph, translationParams);

            }).join(' ')
            : ''
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
        t: TranslationFunction,
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

    /**
     * Replaces matching blocks from inputString.
     *
     * @param t
     * @param inputString
     * @param blocks
     * @param translationParams
     */
    public static prepareNodeStringsFromString (
        inputString: string,
        blocks: ComponentNodeMap,
        t: TranslationFunction,
        translationParams: {readonly [key: string]: any} = {}
    ): string[] {
        const startTag: string = '[[';
        const endTag: string = ']]';
        let input: string = inputString;
        if ( input.length === 0 ) return [];
        const blockKeywords: string[] = map(keys(blocks), (k) => `${startTag}${k}${endTag}`);
        if ( blockKeywords.length === 0 ) {
            return [ input ];
        }
        const itemsFound: string[] = [];
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
                itemsFound.push(t(input.substring(0, index), translationParams));
                input = input.substring(index);
            }

            const b = blocks[foundBlockKey];
            if (b?.toString) {
                itemsFound.push(b.toString());
            }
            input = input.substring(foundKeyword.length);

        } while ( true );
        if ( input.length ) {
            itemsFound.push(t(input, translationParams));
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
