import * as parser from "@formatjs/icu-messageformat-parser";

export const createPluralOrSelectOption = (
    value: Array<parser.MessageFormatElement>
): parser.PluralOrSelectOption => ({
    value,
});

export const createArgumentElement = (
    value: string
): parser.ArgumentElement => ({ type: parser.TYPE.argument, value });
export const createDateElement = ({
    value,
    style,
}: {
    value: string;
    style: string | parser.DateTimeSkeleton;
}): parser.DateElement => ({ type: parser.TYPE.date, value, style });
export const createSelectElement = ({
    value,
    options,
}: {
    value: string;
    options: Record<string, parser.PluralOrSelectOption>;
}): parser.SelectElement => ({ type: parser.TYPE.select, value, options });
export const createPluralElement = ({
    value,
    options,
}: {
    value: string;
    options: Record<parser.ValidPluralRule, parser.PluralOrSelectOption>;
}): parser.PluralElement => ({
    type: parser.TYPE.plural,
    options,
    value,
    // TODO:
    offset: 0,
    // TODO:
    pluralType: "cardinal",
});
export const createTagElement = ({
    value,
    children,
}: {
    value: string;
    children: Array<parser.MessageFormatElement>;
}): parser.TagElement => ({ type: parser.TYPE.tag, value, children });
// TODO: constant
export const createPoundElement = (): parser.PoundElement => ({
    type: parser.TYPE.pound,
});

export * from "@formatjs/icu-messageformat-parser";
