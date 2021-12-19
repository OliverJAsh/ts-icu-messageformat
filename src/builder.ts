import * as R from "fp-ts/Record";
import * as A from "fp-ts/Array";
import { flow, pipe } from "fp-ts/lib/function";
import * as parser from "./parser";

type Nodes = Array<parser.MessageFormatElement>;
const emptyNodes: Nodes = [];

class Builder<A> {
    readonly _A!: A;
    constructor(readonly run: (nodes: Nodes) => Nodes) {}
    then<B>(that: Builder<B>): Builder<A & B> {
        return new Builder((r) => that.run(this.run(r)));
    }
}

export const build = (builder: Builder<unknown>): Nodes =>
    builder.run(emptyNodes);

export const lit = (value: string) =>
    new Builder(A.concatW([pipe(value, parser.createLiteralElement)]));

export const pound = new Builder(A.concatW([parser.createPoundElement()]));

export const arg = <K extends string>(key: K): Builder<{ [_ in K]: string }> =>
    new Builder(A.concatW([pipe(key, parser.createArgumentElement)]));

export const num = <K extends string>(key: K): Builder<{ [_ in K]: number }> =>
    new Builder(A.concatW([pipe(key, parser.createNumberElement)]));

export const date = <K extends string>(
    key: K,
    style: string | parser.DateTimeSkeleton
): Builder<{ [_ in K]: Date }> =>
    new Builder(A.concatW([parser.createDateElement({ value: key, style })]));

// TODO: better value function param/return types?
export const tag = <K extends string, B>(
    key: K,
    childrenBuilder: Builder<B>
): Builder<{ [_ in K]: (xs: Array<unknown>) => unknown } & B> => {
    const children = build(childrenBuilder);
    return new Builder(
        A.concatW([parser.createTagElement({ value: key, children })])
    );
};

export const select = <K extends string, A extends string, B>(
    key: K,
    options: Record<A, Builder<B>>
): Builder<{ [_ in K]: A }> => {
    const optionsRecord = pipe(
        options,
        R.map(flow(build, parser.createPluralOrSelectOption))
    );
    return new Builder(
        A.concatW([
            parser.createSelectElement({ value: key, options: optionsRecord }),
        ])
    );
};

export const plural = <K extends string, B>(
    key: K,
    options: Record<parser.ValidPluralRule, Builder<B>>
): Builder<{ [_ in K]: number }> => {
    const optionsRecord = pipe(
        options,
        R.map(flow(build, parser.createPluralOrSelectOption))
    );
    return new Builder(
        A.concatW([
            parser.createPluralElement({ value: key, options: optionsRecord }),
        ])
    );
};

export type ValuesOf<F extends Builder<any>> = F["_A"];
