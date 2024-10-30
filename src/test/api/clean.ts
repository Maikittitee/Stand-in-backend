import '../db/connection.js'

import { Account } from '../../model/Account.js';
import { User } from '../../model/User.js';
import { Order } from '../../model/Order.js';


const standerUser = await User.findOneAndDelete({ username: 'ts1' });
console.log(standerUser);

const customerUser = await User.findOneAndDelete({ username: 'tc1' });
console.log(customerUser);

const stander = await Account.findOneAndDelete({ user: standerUser!._id });
console.log(stander);

const customer = await Account.findOneAndDelete({ user: customerUser!._id });
console.log(customer);

const order = await Order.deleteMany({ customer: customer!._id });
console.log(order);


process.exit(0);