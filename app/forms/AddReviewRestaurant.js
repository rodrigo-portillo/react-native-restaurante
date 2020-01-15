import t from "tcomb-form-native";
import inputTemplate from "./templates/input";
import textAreaTemplate from "./templates/textArea";

export const AddReviewRestaurantStruct = t.struct({
    title: t.String,
    review: t.String
});

export const AddReviewRestaurantOptions = {
    fields: {
        title: {
            template: inputTemplate,
            config: {
                placeholder: "Titulo de Opinión",
                iconType: "material-community",
                iconName: "silverware"
            }
        },
        review: {
            template: textAreaTemplate,
            config: {
                placeholder: "Opinión"
            }
        }
    }
}