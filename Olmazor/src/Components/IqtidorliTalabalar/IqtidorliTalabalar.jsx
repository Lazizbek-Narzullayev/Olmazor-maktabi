import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function IqtidorliTalabalar() {
  const [talents, setTalents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/talents')
      .then(r => setTalents(r.data.data.talents))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
      <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-16 px-4">
      {/* Hero */}
      <div className="max-w-5xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full mb-6">
          ⭐ Olmazor Maktabi
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
          Iqtidorli Talabalar
        </h1>
        <p className="text-slate-500 font-bold text-sm max-w-xl mx-auto">
          Maktabimizning faxri — yutuqlari bilan ajralib turgan o'quvchilarimiz.
        </p>
      </div>

      {talents.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-20">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-slate-400 font-bold">Hozircha ma'lumot yo'q</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {talents.map(t => (
            <div key={t._id}
              className="bg-white rounded-[28px] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-amber-300 transition-all duration-300 group flex flex-col overflow-hidden cursor-pointer"
              onClick={() => setSelected(t)}
            >
              {/* Photo */}
              <div className="h-48 bg-gradient-to-br from-amber-50 to-orange-50 relative overflow-hidden">
                {t.imageUrl ? (
                  <img src={t.imageUrl} alt={t.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 font-black text-4xl shadow-inner">
                      {t.name[0]}
                    </div>
                  </div>
                )}
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-amber-600 text-[9px] font-black px-2.5 py-1 rounded-full shadow-sm">
                  {t.year}
                </span>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-black text-slate-800 text-sm tracking-tight mb-0.5">{t.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{t.className}-sinf</p>
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl px-3 py-2.5">
                  <span className="text-amber-400 text-xs">⭐</span>
                  <span className="text-xs font-black text-amber-700 line-clamp-2">{t.achievement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-[48px] w-full max-w-sm shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="h-52 bg-gradient-to-br from-amber-400 to-orange-500 relative overflow-hidden">
              {selected.imageUrl ? (
                <img src={selected.imageUrl} alt={selected.name}
                  className="w-full h-full object-cover object-top"
                  onError={e => { e.target.style.display = 'none'; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-white font-black text-5xl">
                    {selected.name[0]}
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all text-lg font-bold">
                ✕
              </button>
              <span className="absolute bottom-4 right-4 bg-white/90 text-amber-600 text-[9px] font-black px-3 py-1.5 rounded-full">
                {selected.year}
              </span>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">{selected.name}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5">{selected.className}-sinf o'quvchisi</p>
              <div className="flex items-start gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 mb-4">
                <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">⭐</span>
                </div>
                <div>
                  <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1">Yutuq</p>
                  <p className="text-sm font-black text-amber-800">{selected.achievement}</p>
                </div>
              </div>
              {selected.description && (
                <p className="text-sm text-slate-500 font-bold leading-relaxed">{selected.description}</p>
              )}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">OLMAZOR MAKTABI · IQTIDORLI TALABA</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
