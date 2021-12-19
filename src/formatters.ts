import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/function";
import * as parser from "./parser";

const formatArgumentElement = (el: parser.ArgumentElement): string =>
    `{${el.value}}`;
const formatDateElement = (el: parser.DateElement): string =>
    el.style !== undefined
        ? `{${el.value}, date, ${el.style}}`
        : `{${el.value}, date}`;
const formatLiteralElement = (el: parser.LiteralElement): string => el.value;
const formatNumberElement = (el: parser.NumberElement): string =>
    el.style !== undefined
        ? `{${el.value}, number, ${el.style}}`
        : `{${el.value}, number}`;
const formatPluralElement = (el: parser.PluralElement): string =>
    `{${el.value}, plural, ${pipe(
        el.options,
        R.collect((k, v) => `${k} {${pipe(v.value, formatElements)}}`)
    ).join(" ")}}`;
const formatPoundElement = (_el: parser.PoundElement): string => "#";
const formatSelectElement = (el: parser.SelectElement): string =>
    `{${el.value}, select, ${pipe(
        el.options,
        R.collect((k, v) => `${k} {${pipe(v.value, formatElements)}}`)
    ).join(" ")}}`;
const formatTagElement = (el: parser.TagElement): string =>
    `<${el.value}>${pipe(el.children, formatElements)}</${el.value}>`;

const formatElement = (el: parser.MessageFormatElement): string => {
    switch (el.type) {
        case parser.TYPE.argument:
            return formatArgumentElement(el);
        case parser.TYPE.date:
            return formatDateElement(el);
        case parser.TYPE.literal:
            return formatLiteralElement(el);
        case parser.TYPE.number:
            return formatNumberElement(el);
        case parser.TYPE.plural:
            return formatPluralElement(el);
        case parser.TYPE.pound:
            return formatPoundElement(el);
        case parser.TYPE.select:
            return formatSelectElement(el);
        case parser.TYPE.tag:
            return formatTagElement(el);
        case parser.TYPE.time:
            throw new Error("unimplemented");
    }
};

export const formatElements = (
    els: Array<parser.MessageFormatElement>
): string => els.map(formatElement).join("");
