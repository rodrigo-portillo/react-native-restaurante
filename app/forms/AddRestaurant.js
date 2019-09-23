import t from "tcomb-form-native";
import InputTemplate from "./templates/input";
import TextAreaTemplate from "./templates/textArea";

export const AddRestaurantStruct = t.struct({
  name: t.String,
  city: t.String,
  address: t.String,
  description: t.String
});

export const AddRestaurantOption = {
  fields: {
    name: {
      template: InputTemplate,
      config: {
        placeholder: "Nombre del Restaurante",
        iconType: "material-community",
        iconName: "silverware"
      }
    },
    city: {
      template: InputTemplate,
      config: {
        placeholder: "Ciudad del Restaurante",
        iconType: "material-community",
        iconName: "city"
      }
    },
    address: {
      template: InputTemplate,
      config: {
        placeholder: "Dirección del Restaurante",
        iconType: "material-community",
        iconName: "map-marker"
      }
    },
    description: {
      template: TextAreaTemplate,
      config: {
        placeholder: "Descripción del Restaurante"
      }
    }
  }
};
