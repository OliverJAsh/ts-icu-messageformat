import * as IntlMessageFormat from "intl-messageformat";
import * as P from "./builder";
import { formatElements } from "./formatters";

const builder = P.arg("name")
    .then(P.lit(" uploaded "))
    .then(
        P.select("gender", {
            male: P.lit("his"),
            female: P.lit("her"),
            other: P.lit("their"),
        })
    )
    .then(P.lit(" "))
    .then(P.tag("firstPhotoLink", P.lit("first photo")))
    .then(P.lit(" on "))
    .then(P.tag("firstUploadDateEl", P.date("firstUploadDate", "long")))
    .then(P.lit(". In total they have "))
    .then(
        P.plural("totalPhotos", {
            one: P.lit("uploaded ").then(P.pound).then(P.lit(" photo")),
            other: P.lit("uploaded ").then(P.pound).then(P.lit(" photos")),
        })
    )
    .then(P.lit("."));

const ast = P.build(builder);
console.log(JSON.stringify(ast, null, "\t"));

const string = formatElements(ast);
console.log(string);

type Values = P.ValuesOf<typeof builder>;
const values: Values = {
    name: "Bob",
    gender: "male",
    totalPhotos: 1000,
    firstUploadDate: new Date(),
    firstPhotoLink: (xs) => xs,
    firstUploadDateEl: (xs) => xs,
};

const result = new IntlMessageFormat.IntlMessageFormat(ast, "en-US").format(
    values
);
console.log(result);
