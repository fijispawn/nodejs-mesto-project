import validator from "validator";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: "Некорректный email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    default: "Жак-Ив Кусто",
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: "Исследователь",
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg",
    validate: {
      validator(v: string) {
        return /^https?:\/\/(www\.)?[\w-]+\.[\w]{2,}([/\w\-._~:/?#[\]@!$&'()*+,;=]*)#?$/.test(
          v
        );
      },
      message: "Некорректный URL аватара",
    },
  },
});

export default mongoose.model("user", userSchema);
