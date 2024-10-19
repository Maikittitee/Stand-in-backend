import { Schema, Types } from 'mongoose';
import { itemSchema, IItem } from './Product.js';
import { addressSchema, IAddress } from './Address.js';


export enum TaskType {
    Queueing = 'Queueing',
    Shopping = 'Shopping',
}
export enum PackageSize {
    Small,
    Medium,
    Laege,
}


interface ITask extends Types.Subdocument {
    kind: TaskType;
}
export const taskSchema = new Schema<ITask>({
    kind: {
        type: String,
        enum: TaskType,
        required: true,
    },
}, {
    discriminatorKey: 'kind',
    _id: false,
});


interface IQueueing extends ITask {
    location: IAddress;
    datetime: Date;
    size: Number;
    detail: String;
}
export const queueingSchema = new Schema<IQueueing>({
    location: {
        type: addressSchema,
        required: true,
    },
    datetime: {
        type: Date,
        required: true,
    },
    size: {
        type: Number,
        enum: PackageSize,
        required: true,
    },
    detail: {
        type: String,
        required: true,
    },
}, {
    _id: false,
});


interface IShopping extends ITask {
    store: Types.ObjectId;
    items: IItem[];
}
export const shoppingSchema = new Schema<IShopping>({
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    items: [itemSchema],
}, {
    _id: false,
});


export function isQueueing(task: any): task is IQueueing {
    return task.kind === TaskType.Queueing;
}
export function isShopping(task: any): task is IShopping {
    return task.kind === TaskType.Shopping;
}


// https://mongoosejs.com/docs/discriminators.html