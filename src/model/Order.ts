import { Schema, model, InferSchemaType, Types } from 'mongoose';
import { TaskType, taskSchema, queueingSchema, shoppingSchema, groupshoppingSchema } from './Task.js';
import { Stander } from './Stander.js';


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
    Delivered,
}


const statusOption = {
    _id: false,
    timestamps: { createdAt: true, updatedAt: false },
};


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


const orderStatusSchema = new Schema({
    status: {
        type: Number,
        enum: OrderStatus,
        required: true,
    },
}, statusOption);


const trackStatusSchema = new Schema({
    status: {
        type: Number,
        enum: TrackStatus,
        required: true,
    },
}, statusOption);


export const orderSchema = new Schema({
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
    task: {
        type: taskSchema,
        required: true,
    },
    orderStatus: {
        type: [orderStatusSchema],
        default: [{ status: OrderStatus.Pending }],
    },
    trackStatus: [trackStatusSchema],
    review: reviewSchema,
}, {
    timestamps: true,
    methods: {
        async getPrice() {
            const tasktype: TaskType = this.task.kind;
            const stander = await Stander.findById(this.stander);

            if (tasktype === TaskType.Queueing) {
                // @ts-ignore
                const task: InferSchemaType<TQueueingSchema> = this.task;
                const pricing = stander!.queueing!.charge;
                const charge: number = pricing.get(task.size)!;

                return charge;
            }
            else if (tasktype === TaskType.Shopping) {
                // @ts-ignore
                const task: InferSchemaType<TShoppingSchema> = this.task;
                const Itemprice = task.items.reduce((s, item) => {
                    // @ts-ignore
                    const price: number = item.getPrice();

                    return s + price;
                }, 0);

                const charge: number = stander!.shopping!.charge;

                return charge + Itemprice;
            }
        },
    },
});

const taskPath = orderSchema.path<Schema.Types.Subdocument>('task');
taskPath.discriminator(TaskType.Queueing, queueingSchema);
taskPath.discriminator(TaskType.Shopping, shoppingSchema);
taskPath.discriminator(TaskType.GroupShopping, groupshoppingSchema);


// https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design
// https://www.mongodb.com/docs/manual/applications/data-models-relationships/
// https://stackoverflow.com/questions/46406380/is-two-way-referencing-more-efficient-in-mongo-for-a-1-to-n-relationship

export const Order = model('Order', orderSchema);