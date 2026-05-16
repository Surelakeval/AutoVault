import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';

// @desc    Get car valuation
// @route   POST /api/valuation
// @access  Public
export const getValuation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { brand, model, year, kms, condition } = req.body;

  // This is a dummy valuation logic for demonstration purposes
  // In a real app, this would use a complex algorithm or external API

  let basePrice = 500000; // Base ₹ 5 Lakh

  // Brand multiplier
  if (brand === 'BMW' || brand === 'Mercedes-Benz' || brand === 'Audi') {
    basePrice += 2000000;
  } else if (brand === 'Hyundai' || brand === 'Honda') {
    basePrice += 300000;
  }

  // Depreciation based on age (10% per year)
  const currentYear = new Date().getFullYear();
  const age = currentYear - parseInt(year);
  const depreciation = Math.pow(0.9, age);
  
  // Depreciation based on kms (1% per 10,000 kms)
  const kmDepreciation = Math.pow(0.99, parseInt(kms) / 10000);

  // Condition multiplier
  let conditionMultiplier = 1;
  if (condition === 'Excellent') conditionMultiplier = 1.1;
  if (condition === 'Good') conditionMultiplier = 1.0;
  if (condition === 'Fair') conditionMultiplier = 0.8;

  const estimatedPrice = basePrice * depreciation * kmDepreciation * conditionMultiplier;

  // Create a range (-10% to +10%)
  const minPrice = Math.round(estimatedPrice * 0.9);
  const maxPrice = Math.round(estimatedPrice * 1.1);

  // Format as INR string
  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹ ${price.toLocaleString('en-IN')}`;
  };

  res.status(200).json({
    success: true,
    data: {
      minPrice: formatPrice(minPrice),
      maxPrice: formatPrice(maxPrice),
      minPriceRaw: minPrice,
      maxPriceRaw: maxPrice,
    }
  });
});
