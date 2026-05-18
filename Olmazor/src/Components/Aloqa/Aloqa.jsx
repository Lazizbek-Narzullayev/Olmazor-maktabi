import React from 'react'

const Aloqa = () => {
  const lat = 41.335259;
  const lon = 69.248385;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lon - 0.0005
  }%2C${lat - 0.0005}%2C${lon + 0.0005}%2C${lat + 0.0005}&layer=mapnik&marker=${lat}%2C${lon}&zoom=18`;

  return (
    <div className='px-[20px] sm:px-[50px] md:px-[100px] lg:px-[150px] py-16'>
      <div className='border border-blue-900 bg-blue-900 rounded-xl h-auto'>
        <div className='flex flex-col lg:flex-row gap-10 lg:gap-20 p-6 lg:p-9'>

          {/* Left side: Contact info */}
          <div className='text-white space-y-6 lg:w-1/2'>
            <div className='space-y-2'>
              <p className='text-3xl font-bold'>Aloqa:</p>
              <p className='text-2xl font-semibold'>+998 (99) 999-99-99</p>
            </div>
            <div className='space-y-2'>
              <p className='text-3xl font-bold'>Manzil:</p>
              <p className='text-2xl font-semibold'>Toshkent sh., Olmazor tumani, Sebzor massivi, 17/18</p>
            </div>
            <div className='space-y-2'>
              <p className='text-3xl font-bold'>Eng yaqin transportlar:</p>
              <p className='text-2xl font-semibold'>Avtobus: 100,123,150,157</p>
              <p className='text-2xl font-semibold'>Metro: G'afur G'ulom metrosi</p>
            </div>
            <div className='space-y-2'>
              <p className='text-3xl font-bold'>Elektron manzil:</p>
              <button className='text-2xl font-semibold hover:text-gray-300'>OlmazorPIMA@manzil</button>
            </div>
          </div>

          {/* Right side: Map */}
          <div className='lg:w-1/2 w-full'>
            <div className='w-full h-[300px] sm:h-[350px] md:h-[400px]'>
              <iframe
                src={mapUrl}
                width="100%"
                height="100%" 
                className="rounded-xl shadow-lg border"
                style={{ border: "1px solid #ccc" }}
              ></iframe>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Aloqa
