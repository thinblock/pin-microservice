import { Schema, model, Document } from 'mongoose';

const PinsSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { collection: 'pins' });

export default model<IPin>('pins', PinsSchema);

export interface IPin extends Document {
  _id: Schema.Types.ObjectId;
  code: string;
  phone: string;
  created_at?: Date;
  updated_at?: Date;
}