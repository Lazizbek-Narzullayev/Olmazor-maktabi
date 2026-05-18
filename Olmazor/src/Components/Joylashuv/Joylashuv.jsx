import React from 'react'

const Joylashuv = () => {

  const lat = 41.335259;
  const lon = 69.248385;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lon - 0.0005
  }%2C${lat - 0.0005}%2C${lon + 0.0005}%2C${lat + 0.0005}&layer=mapnik&marker=${lat}%2C${lon}&zoom=18`;

  return (
    <div className="px-10 py-10">
      <h2 className="text-3xl font-bold mb-4">Bizning manzil</h2>
      <iframe
        src={mapUrl}
        width="100%"
        height="400"
        className="rounded-xl shadow-lg border"
        style={{ border: "1px solid #ccc" }}
      ></iframe>
      <a
        href={`https://yandex.com/maps/?rtext=~${lat},${lon}&rtt=taxi`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="mt-5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-xl shadow-lg">
          Yandex Taxi chaqirish
        </button>
      </a>
    </div>
  )
}

export default Joylashuv
