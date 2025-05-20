import React from 'react';
import { assets, exclusiveOffers } from '../assets/assets';
import Title from './Title';
import StarRatings from './StarRatings';

const ExclusiveOffer = () => {
  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-30'>
      <div className='flex flex-col md:flex-row items-center justify-between w-full'>
        <Title
          align='left'
          title='Exclusive Offers'
          subTitle='Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.'
        />
        <button className='group flex items-center gap-2 font-medium cursor-pointer max-md:mt-12'>
          View All Offers
          <img
            src={assets.arrowIcon}
            alt='arrow-icon'
            className='group-hover:translate-x-1 transition-all'
          />
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full'>
        {exclusiveOffers.map((item, index) => (
          <div
            key={item.id || index}
            className='group relative flex flex-col justify-between gap-4 p-6 rounded-xl text-white bg-cover bg-center bg-no-repeat min-h-[320px]'
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <p className='px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full'>
              {item.priceOff}% OFF
            </p>
            <div>
              <p className='text-2xl font-medium font-playfair'>{item.title}</p>
              <p className='text-sm mt-2'>{item.description}</p>
              <StarRatings rating={item.rating || 4} />
              <p className='text-xs text-white/70 mt-3'>Expires {item.expiryDate}</p>
            </div>
            <button className='flex items-center gap-2 font-medium cursor-pointer mt-4'>
              View Offers
              <img
                src={assets.arrowIcon}
                alt='arrow-icon'
                className='invert group-hover:translate-x-1 transition-all'
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExclusiveOffer;
