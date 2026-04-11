import mongoose from "mongoose";
const deliverySchema = new mongoose.Schema(
   {
      deliveryBoy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         default: null,
      },
      status: {
         type: String,
         enum: ["NOT_ASSIGNED", "ACCEPTED", "PICKED_UP", "DELIVERED"],
         default: "NOT_ASSIGNED",
      },
      acceptedAt: {
         type: Date,
         default: null,
      },
      pickupAt: {
         type: Date,
         default: null,
      },
      deliveredAt: {
         type: Date,
         default: null,
      },
   },
   { _id: false },
);
const orderSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },

      shop: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Shop",
         required: true,
      },

      items: [
         {
            product: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Food",
               required: true,
            },

            name: {
               type: String,
               required: true,
            },

            price: {
               type: Number,
               required: true,
            },

            quantity: {
               type: Number,
               required: true,
            },

            foodImg: String,
         },
      ],
      subtotal: {
         type: Number,
         required: true,
      },

      deliveryFee: {
         type: Number,
         default: 99,
      },
      deliveryBoyEarn: {
         type: Number,
         default: 25,
      },
      totalAmount: {
         type: Number,
         required: true,
      },

      paymentMethod: {
         type: String,
         enum: ["COD", "ONLINE"],
         required: true,
      },

      paymentStatus: {
         type: String,
         enum: ["PENDING", "PAID", "FAILED"],
         default: "PENDING",
      },

      payment: {
         paid: {
            type: Boolean,
            default: false,
         },

         razorpayOrderId: {
            type: String,
         },

         razorpayPaymentId: {
            type: String,
         },
      },
      orderStatus: {
         type: String,
         enum: [
            "PLACED",
            "PREPARING",
            "READY_FOR_DELIVERY",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED",
         ],
         default: "PLACED",
      },
      deliveryAdd: {
         text: {
            type: String,
            required: true,
         },
         latitude: {
            type: Number,
            required: true,
         },
         longitude: {
            type: Number,
            required: true,
         },
      },
      deliveryAssignment: {
         type: deliverySchema,
         default: {
            deliveryBoy: null,
            status: "NOT_ASSIGNED",
            acceptedAt: null,
            pickupAt: null,
            deliveredAt: null,
         },
      },

      deliveryOTP: {
         type: String,
      },

      otpVerified: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
