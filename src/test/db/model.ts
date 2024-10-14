import { Building, Store } from '../../model/address.js';
import { Order, OrderStatus, TrackStatus } from '../../model/order.js';
import { Brand, Product, ProductModel } from '../../model/product.js';
import { TaskType, PackageSize } from '../../model/task.js';

import './db.js';

export const siam_paragon = new Building({
    name: 'Siam Paragon',
    address: {
        country: 'Thailand',
        zipcode: '10330',
        province: 'Bangkok',
        district: 'Pathum Wan',
        subdistrict: 'Pathum Wan',
        detail: '991 Rama I Rd',
    },
});
export const ct_music_addr = new Building({
    address: {
        country: 'Thailand',
        zipcode: '10110',
        province: 'Bangkok',
        district: 'Klongtoey',
        subdistrict: 'Prakanhong',
        detail: '72/1-6 Sukhumvit 40',
    },
});
export const promenade = new Building({
    name: 'The Promenade',
    address: {
        country: 'Thailand',
        zipcode: '10230',
        province: 'Bangkok',
        district: 'Khan Na Yao',
        subdistrict: 'Khan Na Yao',
        detail: '587,589 589/7-9 Ram Inthra Rd',
    },
});

export const music_collection = new Store({
    name: 'Music Collection',
    building: siam_paragon._id,
});
export const ct_music = new Store({
    name: 'CT Music',
    building: ct_music_addr._id,
});
export const cin_guitar = new Store({
    name: 'Cin Guitar',
    building: promenade._id,
});

export const crafter = new Brand({
    name: 'Crafter',
    logo: 'http://www.crafterguitars.com/eng/images/common/h_logo.png',
});
export const cort = new Brand({
    name: 'Cort',
    logo: 'https://www.cortguitars.com/wp-content/uploads/2024/08/Cort-logo-black-1.svg',
});
export const ibanez = new Brand({
    name: 'Ibanez',
    logo: 'https://www.ibanez.com/images/logo_acoustic.png',
});
export const taylor = new Brand({
    name: 'Taylor',
    logo: 'https://www.taylorguitars.com/sites/default/files/styles/brand_bar_logo/public/images/2024-01/desktop-logo_1.png?itok=g40Dt6Oa',
});

export const tmc035 = new ProductModel({
    name: 'TMC-035EQ',
    brand: crafter._id,
    category: undefined,
    variant: [
        {
            images: [
                'https://images.squarespace-cdn.com/content/v1/549721b4e4b08be712d559be/1446476048437-8SI3ZPVYISJLFZW4VQ80/TM-1.jpg',
            ],
            price: 19600,
            description: 'One of the best "Orchestra" body type guitars',
            option: undefined,
        },
    ],
});
export const flow_oc = new ProductModel({
    name: 'Flow-OC',
    brand: cort._id,
    category: undefined,
    variant: [
        {
            images: [
                'https://www.cortguitars.com/wp-content/uploads/2024/06/cort-flow-oc-acoustic-electric-guitar-gal-1.jpg',
                'https://www.cortguitars.com/wp-content/uploads/2024/06/cort-flow-oc-acoustic-electric-guitar-gal-2.jpg',
                'https://www.cortguitars.com/wp-content/uploads/2024/06/cort-flow-oc-acoustic-electric-guitar-gal-5.jpg',
            ],
            price: 29900,
            description: 'Innovative Design Most Suited for Fingerstyle Artists & Enthusiasts',
            option: undefined,
        },
    ],
});
export const guitar_mod1 = new ProductModel({
    name: 'ACFS580CE',
    brand: ibanez._id,
    category: undefined,
    variant: [
        {
            images: [
                'https://www.ibanez.com/common/product_artist_file/file/p_region_ACFS580CE_OPS_1X_02.png',
            ],
            price: 39000,
            description: 'Every single detail is designed to cover a wide range of playing styles; Whether you’re a traditional fingerpicker, or at the forefront of modern percussive playing.',
            option: undefined,
        },
    ],
});
export const guitar_mod2 = new ProductModel({
    name: 'PA230E',
    brand: ibanez._id,
    category: undefined,
    variant: [
        {
            images: [
                'https://www.ibanez.com/common/product_artist_file/file/p_region_PA230E_NSL_1X_02.png',
            ],
            price: 25900,
            description: 'This line features a uniquely shaped asymmetrical jumbo body with slightly more surface area on the upper side of the body',
            option: undefined,
        },
    ],
});
export const guitar_mod3 = new ProductModel({
    name: '812ce',
    brand: taylor._id,
    category: undefined,
    variant: [
        {
            images: [
                'https://www.taylorguitars.com/sites/default/files/styles/guitar_desktop/public/2022-02-08/812ce-Front.png?itok=D7kqUZZS',
            ],
            price: 147000,
            description: 'Built on the all-star tonewood pairing of Indian rosewood and Sitka spruce, the 812ce offers players a more compact take on the flagship Taylor experience.',
            option: undefined,
        },
    ],
});

// guitar selling at store
export const old_guitar = new Product({
    store: music_collection._id,
    model: tmc035._id,
    subproduct: [{
        variant: tmc035.variant[0]._id,
        available: true,
    }],
});
export const great_one = new Product({
    store: ct_music._id,
    model: flow_oc._id,
    subproduct: [{
        variant: flow_oc.variant[0]._id,
        available: true,
    }],
});

export const guitar_order = new Order({
    task: {
        kind: TaskType.Shopping,
        store: music_collection._id,
        items: [{
            product: old_guitar._id,
            variant: tmc035.variant[0]._id,
            quantity: 1,
        }],
    },
    status: OrderStatus.Paid,
    trackStatus: [
        {
            datetime: Date.now(),
            status: TrackStatus.On_the_way
        }, {
            datetime: Date.now(),
            status: TrackStatus.Arrived_at_store
        }, {
            datetime: Date.now(),
            status: TrackStatus.Item_recieved
        },
    ],
    review: {
        rating: 4,
        comment: 'I am satisfied',
    },
    // stander: '',
    // customer: '',
});

export const queue_order = new Order({
    task: {
        kind: TaskType.Queueing,
        location: {
            country: 'Thailand',
            zipcode: '10330',
            province: 'Bangkok',
            district: 'Pathum Wan',
            subdistrict: 'Pathum Wan',
            detail: 'some where',
        },
        datetime: Date.now(),
        size: PackageSize.Small,
        detail: 'I hire you',
    },
    status: OrderStatus.Pending,
    // review: undefined,
    // trackStatus: [],
    // stander: '',
    // customer: '',
});


console.log(await siam_paragon.save());
console.log(await ct_music_addr.save());
console.log(await promenade.save());

console.log(await music_collection.save());
console.log(await ct_music.save());
console.log(await cin_guitar.save());

console.log(await crafter.save());
console.log(await cort.save());
console.log(await ibanez.save());
console.log(await taylor.save());

console.log(await tmc035.save());
console.log(await flow_oc.save());
console.log(await guitar_mod1.save());
console.log(await guitar_mod2.save());
console.log(await guitar_mod3.save());

console.log(await old_guitar.save());
console.log(await great_one.save());

console.log(await guitar_order.save());
console.log(await queue_order.save());