import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stocks: [{
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    buyPrice: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now }
  }]
});

export default mongoose.model('Portfolio', PortfolioSchema);