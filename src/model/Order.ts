import { Schema, model } from 'mongoose';
import { TaskType, taskSchema, queueingSchema, shoppingSchema } from './Task.js';


export enum OrderStatus {
    Pending,
    Cancelled,
    Accepted,
    Rejected,
    Paid,
    Completed,
}

export enum TrackStatus {
    On_the_way,
    Arrived_at_store,
    Item_recieved,
    Package_sent,
    In_transit,
}


const reviewSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
    },
}, {
    _id: false,
    timestamps: true,
});


export const orderSchema = new Schema({
    task: {
        type: taskSchema,
        required: true,
    },
    status: {
        type: Number,
        enum: OrderStatus,
        default: OrderStatus.Pending,
        required: true,
    },
    trackStatus: [{
        _id: false,
        datetime: {
            type: Date,
            required: true,
        },
        status: {
            type: Number,
            enum: TrackStatus,
            required: true,
        },
    }],
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    stander: {
        type: Schema.Types.ObjectId,
        ref: 'Stander',
        required: true,
    },
    review: reviewSchema,
}, {
    timestamps: true,
});

const taskPath = orderSchema.path<Schema.Types.Subdocument>('task');
taskPath.discriminator(TaskType.Queueing, queueingSchema);
taskPath.discriminator(TaskType.Shopping, shoppingSchema);


// https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design
// https://www.mongodb.com/docs/manual/applications/data-models-relationships/
// https://stackoverflow.com/questions/46406380/is-two-way-referencing-more-efficient-in-mongo-for-a-1-to-n-relationship

export const Order = model('Order', orderSchema);