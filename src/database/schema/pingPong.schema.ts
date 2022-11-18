import { Schema } from 'ottoman';

const PingPongSchema = new Schema({
  initialized: { type: Boolean, required: true },
  dateCreated: { type: Date, required: false },
  dateLastModified: { type: Date, required: false },
});

export { PingPongSchema };
