import { HydratedDocumentFromSchema, Schema, ObtainSchemaGeneric, Model, HydratedDocument, InferSchemaType } from 'mongoose';

import { accountSchema } from '../model/Account.js';
import { standerSchema } from '../model/Stander.js';
import { customerSchema } from '../model/Customer.js';
import { modelSchema } from '../model/Product.ts';
import { orderSchema } from '../model/Order.js';
import { taskSchema, queueingSchema, shoppingSchema } from '../model/Task.js';


// type MethodsFrom<T>     = T extends Schema<any, any, infer Medthods, any, infer Virtuals, any, any, infer DocType> ? Medthods : never;
// type DoctypeFrom<T>     = T extends Schema<any, any, infer Medthods, any, infer Virtuals, any, any, infer DocType> ? DocType : never;
type CombinedSchema<SchemaA extends Schema, SchemaB extends Schema> = Schema<
    ObtainSchemaGeneric<SchemaA, 'EnforcedDocType'> & ObtainSchemaGeneric<SchemaB, 'EnforcedDocType'>,
    ObtainSchemaGeneric<SchemaA, 'M'> & ObtainSchemaGeneric<SchemaB, 'M'>,
    ObtainSchemaGeneric<SchemaA, 'TInstanceMethods'> & ObtainSchemaGeneric<SchemaB, 'TInstanceMethods'>,
    ObtainSchemaGeneric<SchemaA, 'TQueryHelpers'> & ObtainSchemaGeneric<SchemaB, 'TQueryHelpers'>,
    ObtainSchemaGeneric<SchemaA, 'TVirtuals'> & ObtainSchemaGeneric<SchemaB, 'TVirtuals'>,
    ObtainSchemaGeneric<SchemaA, 'TStaticMethods'> & ObtainSchemaGeneric<SchemaB, 'TStaticMethods'>,
    ObtainSchemaGeneric<SchemaA, 'TSchemaOptions'> & ObtainSchemaGeneric<SchemaB, 'TSchemaOptions'>,
    ObtainSchemaGeneric<SchemaA, 'DocType'> & ObtainSchemaGeneric<SchemaB, 'DocType'>
>;


declare global {
    // from mongoose model() function
    type ModelFromSchema<TSchema extends Schema> = Model<
        InferSchemaType<TSchema>,
        ObtainSchemaGeneric<TSchema, 'TQueryHelpers'>,
        ObtainSchemaGeneric<TSchema, 'TInstanceMethods'>,
        ObtainSchemaGeneric<TSchema, 'TVirtuals'>,
        HydratedDocument<
            InferSchemaType<TSchema>,
            ObtainSchemaGeneric<TSchema, 'TVirtuals'> & ObtainSchemaGeneric<TSchema, 'TInstanceMethods'>,
            ObtainSchemaGeneric<TSchema, 'TQueryHelpers'>
        >,
        TSchema
    > & ObtainSchemaGeneric<TSchema, 'TStaticMethods'>;


    type TAccount           = HydratedDocumentFromSchema<typeof accountSchema>;
    type TCustomerSchema    = CombinedSchema<typeof accountSchema, typeof customerSchema>;
    type TStanderSchema     = CombinedSchema<typeof accountSchema, typeof standerSchema>;

    type TCustomer          = HydratedDocumentFromSchema<TCustomerSchema>;
    type TStander           = HydratedDocumentFromSchema<TStanderSchema>;
    type TQueueing          = HydratedDocumentFromSchema<CombinedSchema<typeof taskSchema, typeof queueingSchema>>;
    type TShopping          = HydratedDocumentFromSchema<CombinedSchema<typeof taskSchema, typeof shoppingSchema>>;
    type TProductModel      = HydratedDocumentFromSchema<typeof modelSchema>;
    type TOrder             = HydratedDocumentFromSchema<typeof orderSchema>;
}