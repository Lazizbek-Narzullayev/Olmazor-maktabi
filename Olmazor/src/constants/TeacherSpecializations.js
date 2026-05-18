const RAW_SPECIALIZATIONS = [
  "Ingliz tili oʻqituvchisi",
  "Rus tili o'qituvchisi",
  "Matematika (Yo'nalishlar bo'yicha, Differensial tenglamalar)",
  "kimyo",
  "Fizik, fizik muhandis, fizik pedagog",
  "Ehtimollar nazaryasi va matematik statistika",
  "Filologiya va tillarni o'qitish :o'zbek tili",
  "Matematika o`qitish metodikasi",
  "Amaliy geografiya",
  "Jismoniy tarbiya va jismoniy madaniyat",
  "Chizmachilik va tasviriy san'at o'qituvchisi",
  "Filologiya Ingliz tili",
  "o‘zbek filologiyasi",
  "Kimyo",
  "o'zbek tili va adabiyoti",
  "ingliz va nemis tillari o`qituvchisi",
  "Matematika(Yo'nalishlar bo'yicha)",
  "Ingliz tili filolog",
  "Fizik va informatik o'qituvchi",
  "Amaliy matematika va informatika",
  "Ingliz tili va adabiyoti",
  "Tarix",
  "Tarix va davlat huquq asoslari o'qituvchisi",
  "Matematik. O'qituvchi",
  "Matematika va informatika òqituvchisi",
  "Matematika o'qituvchisi",
  "Ingliz tili filologiyasi",
  "Matematika va informatika",
  "Matematika",
  "Fizika",
  "Oʻzbek tili va adabiyot",
  "Kimyo o'qitish metodikasi",
  "Kasb ta'limi",
  "Sport faoliyati",
  "Sport psixologiyasi",
  "Fizik, Fizik-muhandis, pedagog",
  "Amaliy matematika va fizika",
  "Tarbiya, Huquq",
  "Amaliy matematika va informatikka",
  "Rus tili va adabiyoti o'zga tilli guruhlarda",
  "Milliy maktablarda Rus tili va adabiyoti",
  "Filologiya va tillarni oʻqitish: oʻzbek tili",
  "Fizika,matematika,pedagog",
  "Ingliz tilini ikkinchi tel sifatida o'qitish",
  "Biolog, Biofizik tadqiqotchi, pedagog",
  "Xizmat ko'rsatish texnikasi va texnologiyasi",
  "Biolog. Biologiya o'qituvchisi",
  "Tarix o'qituvchisi"
];

// Remove duplicates and sort
export const SPECIALIZATIONS = [...new Set(RAW_SPECIALIZATIONS)].sort();

export const BASE_SUBJECTS = [
  "Matematika",
  "Ingliz tili",
  "Rus tili",
  "O'zbek tili",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Informatika",
  "Tarix",
  "Geografiya",
  "Jismoniy tarbiya",
  "Chizmachilik",
  "Texnologiya",
  "Tarbiya",
  "Huquq"
];

// Mapping for filtering
export const getBaseSubject = (spec) => {
  if (!spec) return "Boshqa";
  const s = spec.toLowerCase();
  
  if (s.includes('matematik') || s.includes('algebra') || s.includes('geometr') || s.includes('ehtimollar')) return "Matematika";
  if (s.includes('ingliz')) return "Ingliz tili";
  if (s.includes('rus')) return "Rus tili";
  if (s.includes('o‘zbek') || s.includes('o\'zbek') || s.includes('ona tili') || s.includes('filologiya') || s.includes('adabiyot')) return "O'zbek tili";
  if (s.includes('fizik')) return "Fizika";
  if (s.includes('kimyo')) return "Kimyo";
  if (s.includes('biolog')) return "Biologiya";
  if (s.includes('informat')) return "Informatika";
  if (s.includes('tarix')) return "Tarix";
  if (s.includes('geogra')) return "Geografiya";
  if (s.includes('jismoniy') || s.includes('sport')) return "Jismoniy tarbiya";
  if (s.includes('chizma') || s.includes('san\'at')) return "Chizmachilik";
  if (s.includes('texnolog') || s.includes('kasb') || s.includes('texnika')) return "Texnologiya";
  if (s.includes('tarbiya')) return "Tarbiya";
  if (s.includes('huquq')) return "Huquq";
  
  return "Boshqa";
};
