import React from 'react'
import Hero from '../Components/Hero'
import FeaturedDestination from '../Components/FeaturedDestination'
import ExclusiveOffer from '../Components/ExclusiveOffer'
import Testimonial from '../Components/Testimonial'
import NewsLetter from '../Components/NewsLetter'

const Home = () => {
  return (
    <>
        <Hero/>
        <FeaturedDestination/>
        <ExclusiveOffer/>
        <Testimonial/>
        <NewsLetter/>
    </>
  )
}

export default Home