import { HydratedDocumentFromSchema, Schema, ObtainSchemaGeneric, Model, HydratedDocument, InferSchemaType } from 'mongoose';

import { accountSchema } from '../model/Account.js';
import { standerSchema } from '../model/Stander.js';
import { customerSchema } from '../model/Customer.js';
import { modelSchema } from '../model/Product.ts';
import { orderSchema } from '../model/Order.js';
import { productSchema } from '../model/Product.ts';
import { userSchema } from '../model/User.js';
import { taskSchema, queueingSchema, shoppingSchema, groupshoppingSchema } from '../model/Task.js';


// type MethodsFrom<T>     = T extends Schema<any, any, infer Medthods, any, infer Virtuals, any, any, infer DocType> ? Medthods : never;
// type DoctypeFrom<T>     = T extends Schema<any, any, infer Medthods, any, infer Virtuals, any, any, infer DocType> ? DocType : never;
type Discriminator<ParentSchema extends Schema, ExtendedSchema extends Schema> = Schema<
    ObtainSchemaGeneric<ParentSchema, 'EnforcedDocType'> & ObtainSchemaGeneric<ExtendedSchema, 'EnforcedDocType'>,
    ObtainSchemaGeneric<ParentSchema, 'M'> & ObtainSchemaGeneric<ExtendedSchema, 'M'>,
    ObtainSchemaGeneric<ParentSchema, 'TInstanceMethods'> & ObtainSchemaGeneric<ExtendedSchema, 'TInstanceMethods'>,
    ObtainSchemaGeneric<ParentSchema, 'TQueryHelpers'> & ObtainSchemaGeneric<ExtendedSchema, 'TQueryHelpers'>,
    ObtainSchemaGeneric<ParentSchema, 'TVirtuals'> & ObtainSchemaGeneric<ExtendedSchema, 'TVirtuals'>,
    ObtainSchemaGeneric<ParentSchema, 'TStaticMethods'> & ObtainSchemaGeneric<ExtendedSchema, 'TStaticMethods'>,
    ObtainSchemaGeneric<ParentSchema, 'TSchemaOptions'> & ObtainSchemaGeneric<ExtendedSchema, 'TSchemaOptions'>,
    ObtainSchemaGeneric<ParentSchema, 'DocType'> & ObtainSchemaGeneric<ExtendedSchema, 'DocType'>
>;


declare global {
    // mimick from mongoose model() function
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

    type TCustomerSchema    = Discriminator<typeof accountSchema, typeof customerSchema>;
    type TStanderSchema     = Discriminator<typeof accountSchema, typeof standerSchema>;
    type TQueueingSchema    = Discriminator<typeof taskSchema, typeof queueingSchema>
    type TShoppingSchema    = Discriminator<typeof taskSchema, typeof shoppingSchema>
    type TGShoppingSchema   = Discriminator<typeof taskSchema, typeof groupshoppingSchema>

    type TUser              = HydratedDocumentFromSchema<typeof userSchema>;
    type TProduct           = HydratedDocumentFromSchema<typeof productSchema>;
    type TProductModel      = HydratedDocumentFromSchema<typeof modelSchema>;
    type TOrder             = HydratedDocumentFromSchema<typeof orderSchema>;

    type TAccount           = HydratedDocumentFromSchema<typeof accountSchema>;
    type TCustomer          = HydratedDocumentFromSchema<TCustomerSchema>;
    type TStander           = HydratedDocumentFromSchema<TStanderSchema>;

    type TQueueing          = HydratedDocumentFromSchema<TQueueingSchema>;
    type TShopping          = HydratedDocumentFromSchema<TShoppingSchema>;
    type TGroupShopping     = HydratedDocumentFromSchema<TGShoppingSchema>;
}