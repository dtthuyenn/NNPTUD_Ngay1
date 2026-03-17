let mongoose = require('mongoose');
const inventoryModel = require("./inventory"); // 👈 thêm dòng này

let productSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: [true, "title khong duoc trung"],
        required: [true, "title khong duoc rong"]
    },
    slug: {
        type: String,
        unique: [true, "slug khong duoc trung"],
        required: [true, "slug khong duoc rong"]
    },
    price: {
        type: Number,
        default: 0,
        min: [0, "gia khong duoc nho hon 0"],
    },
    description: {
        type: String,
        default: ""
    },
    images: {
        type: [String],
        default: ["https://i.imgur.com/ZANVnHE.jpeg"]
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


// 🔥 HOOK xử lý slug
productSchema.pre('save', async function () {
    let Product = this.constructor;
    let products = await Product.find({
        slug: new RegExp(this.slug, 'i')
    });
    if (products.length > 0) {
        this.slug = this.slug + "-" + products.length
    }
})


// 🚀 HOOK tạo inventory sau khi tạo product
productSchema.post('save', async function (doc) {
    try {
        await inventoryModel.create({
            product: doc._id,
            stock: 0,
            reserved: 0,
            soldCount: 0
        });
    } catch (err) {
        console.error("Create inventory error:", err.message);
    }
})

module.exports = mongoose.model('product', productSchema);