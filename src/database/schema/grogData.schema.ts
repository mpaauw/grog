import { Schema } from 'ottoman';

const GrogDataSchema = new Schema({
  version: { type: String, required: true },
  dataSource: { type: Schema.Types.Mixed, required: true },
  data: { type: Schema.Types.Mixed, required: true },
});

export { GrogDataSchema };
