// Kartu pengetahuan ringkas per hama, ditulis dalam bahasa sehari-hari (ID/EN).
// Isinya diringkas dari CSV referensi hama dan pestisida (sumber: BB Padi/BPTP, Balitsa, Balitsereal, IRRI Rice Doctor, jurnal).
type Teks = { id: string; en: string };
export interface KartuPengetahuan { bahaya: Teks; cekBesok: Teks; langkahPertama: Teks; hindari: Teks }

const ULAT_TANAH: KartuPengetahuan = {
  bahaya: {
    id: "Ulat tanah bersembunyi di dalam tanah pada siang hari, lalu keluar malam hari untuk memotong pangkal batang tanaman muda. Tanaman yang sudah terpotong tidak bisa tumbuh lagi, jadi kerugiannya langsung terasa sebagai tanaman yang hilang.",
    en: "Cutworms hide in the soil by day and come out at night to cut young plants at the base. A cut plant cannot regrow, so the loss shows up directly as missing plants.",
  },
  cekBesok: {
    id: "Pagi hari, cari tanaman muda yang rebah atau terpotong. Gali tanah dangkal di sekitarnya: ulat biasanya melingkar di situ.",
    en: "In the morning, look for young plants that are toppled or cut. Dig the topsoil around them: the caterpillar is usually curled up nearby.",
  },
  langkahPertama: {
    id: "Pungut ulat di sekitar tanaman yang terpotong. Umpan berisi virus NPV atau jamur Beauveria dapat menekan populasi tanpa membunuh musuh alami.",
    en: "Pick the caterpillars around cut plants. Bait containing NPV virus or Beauveria fungus can reduce numbers without killing natural enemies.",
  },
  hindari: {
    id: "Jangan menyemprot seluruh lahan. Bila populasi sangat tinggi, cukup semprot di titik serangan dengan produk terdaftar.",
    en: "Do not spray the whole field. If numbers are very high, spot-treat only the damaged patches with a registered product.",
  },
};

const PENGGEREK_PADI: KartuPengetahuan = {
  bahaya: {
    id: "Ulatnya masuk dan makan di dalam batang. Saat padi masih muda, pucuknya mati (sundep). Saat padi bermalai, malainya putih dan hampa (beluk). Beluk tidak bisa dipulihkan, jadi waktu terbaik bertindak adalah sebelum padi bunting.",
    en: "The caterpillar bores into and feeds inside the stem. On young rice the central shoot dies (deadheart); on flowering rice the panicle turns white and empty (whitehead). Whiteheads cannot be fixed, so the best time to act is before booting.",
  },
  cekBesok: {
    id: "Tarik pucuk yang layu: kalau mudah tercabut, itu sundep. Cari kelompok telur di daun dan hitung anakan yang terserang. Ambangnya sekitar 10 persen anakan terserang.",
    en: "Pull wilted shoots: if they come out easily, it is deadheart. Look for egg masses on leaves and count damaged tillers. The action threshold is about 10 percent damaged tillers.",
  },
  langkahPertama: {
    id: "Kumpulkan dan musnahkan kelompok telur. Setelah panen, potong jerami serendah mungkin lalu genangi lahan agar ulat di tunggul mati.",
    en: "Collect and destroy egg masses. After harvest, cut straw as low as possible and flood the field so larvae in the stubble die.",
  },
  hindari: {
    id: "Jangan menyemprot saat beluk sudah terlihat; itu sudah terlambat. Bila lebih dari separuh kelompok telur sudah diparasit, obat tidak diperlukan.",
    en: "Do not spray once whiteheads appear; it is already too late. If more than half of the egg masses are parasitised, no pesticide is needed.",
  },
};

export const PENGETAHUAN: Record<number, KartuPengetahuan> = {
  0: {
    bahaya: { id: "Ulat melipat daun padi dan memakan hijau daunnya dari dalam, sehingga daun bergaris putih. Serangan berat membuat sawah tampak seperti terbakar dan mengurangi bahan untuk mengisi gabah.", en: "The caterpillar folds rice leaves and eats the green tissue from inside, leaving white streaks. Heavy attacks make the field look scorched and reduce what the plant can put into the grain." },
    cekBesok: { id: "Cari daun yang terlipat seperti tabung berisi ulat dan kotoran, terutama di bagian sawah yang teduh, rimbun, atau dipupuk banyak.", en: "Look for leaves folded into tubes with a caterpillar and droppings inside, especially in shaded, dense, or heavily fertilised parts of the field." },
    langkahPertama: { id: "Bersihkan gulma rumput di pematang dan jangan memupuk nitrogen berlebihan.", en: "Clear grassy weeds on the bunds and avoid too much nitrogen fertiliser." },
    hindari: { id: "Jangan buru-buru menyemprot di awal tanam. Tanaman muda masih bisa pulih, sementara semprotan justru membunuh musuh alami.", en: "Do not rush to spray early in the season. Young plants can recover, while spraying kills natural enemies." },
  },
  1: {
    bahaya: { id: "Ulat hijau ini mengerok dan menggigit tepi daun padi sehingga daun bertakik. Kerusakannya biasanya ringan karena ulat ini punya banyak musuh alami.", en: "This green caterpillar scrapes and notches the edges of rice leaves. Damage is usually light because it has many natural enemies." },
    cekBesok: { id: "Lihat tepi daun yang bertakik dan cari ulat hijau muda di daun, terutama di sawah yang dipupuk banyak.", en: "Look for notched leaf edges and pale green caterpillars, especially in heavily fertilised fields." },
    langkahPertama: { id: "Biarkan musuh alami bekerja dan cukup pantau seminggu sekali.", en: "Let natural enemies work and simply check once a week." },
    hindari: { id: "Gejalanya mirip ulat lain dan sistem sering keliru untuk hama ini. Pastikan ulatnya terlihat sebelum bertindak.", en: "Symptoms look like other caterpillars and the system is often wrong for this pest. Make sure you see the caterpillar before acting." },
  },
  2: {
    bahaya: { id: "Belatung lalat ini merusak daun muda yang masih menggulung, sehingga daun berbercak, mudah patah, dan anakan berkurang.", en: "The maggot damages young leaves that are still rolled, so leaves become spotted, break easily, and fewer tillers form." },
    cekBesok: { id: "Cari bercak kuning atau putih dan lubang kecil pada daun yang baru membuka di sawah yang tergenang.", en: "Look for yellow or white spots and small holes on newly opened leaves in flooded fields." },
    langkahPertama: { id: "Cukup dipantau. Tanaman biasanya pulih sendiri saat jumlah anakan mencapai maksimum.", en: "Just monitor. Plants usually recover on their own by maximum tillering." },
    hindari: { id: "Jangan menyemprot hanya karena melihat bercak; kerusakan ini jarang menurunkan hasil panen.", en: "Do not spray just because you see spots; this damage rarely reduces yield." },
  },
  3: PENGGEREK_PADI,
  4: PENGGEREK_PADI,
  5: {
    bahaya: { id: "Larva ganjur mengubah anakan padi menjadi tabung keperakan seperti daun bawang. Anakan yang sudah berubah tidak akan menghasilkan malai.", en: "Gall midge larvae turn rice tillers into silvery tubes that look like onion leaves. Those tillers will never produce a panicle." },
    cekBesok: { id: "Hitung anakan berbentuk tabung perak pada fase anakan, terutama setelah beberapa hari mendung atau hujan.", en: "Count silvery tube-shaped tillers during tillering, especially after several cloudy or rainy days." },
    langkahPertama: { id: "Gunakan varietas tahan dan bersihkan singgang serta tanaman inang di luar musim tanam.", en: "Use resistant varieties and remove ratoons and host plants between seasons." },
    hindari: { id: "Gejalanya mirip kekeringan atau kekurangan kalium. Belah tunasnya untuk memastikan ada larva sebelum bertindak.", en: "It can look like drought or potassium deficiency. Split the shoot to confirm larvae before acting." },
  },
  6: {
    bahaya: { id: "Larvanya hidup di dalam batang dan merusak titik tumbuh serta malai muda. Hama ini umum di Asia Timur dan keberadaannya di Indonesia belum dipastikan.", en: "The larva lives inside the stem and damages the growing point and young panicle. It is common in East Asia and its presence in Indonesia is not confirmed." },
    cekBesok: { id: "Simpan foto atau contoh serangganya dan tunjukkan ke petugas POPT untuk dipastikan jenisnya.", en: "Keep the photo or a specimen and show it to a pest observer to confirm the species." },
    langkahPertama: { id: "Laporkan temuan ke petugas sebelum mengambil tindakan apa pun.", en: "Report the finding to an officer before taking any action." },
    hindari: { id: "Jangan langsung menyemprot; larva di dalam batang hampir tidak terkena obat.", en: "Do not spray straight away; larvae inside the stem are barely reached by pesticides." },
  },
  7: {
    bahaya: { id: "Wereng batang coklat mengisap cairan di pangkal batang. Saat populasinya tinggi, padi mengering dan mati melingkar (hopperburn). Wereng ini juga menularkan virus kerdil hampa dan kerdil rumput yang tidak bisa diobati.", en: "Brown planthoppers suck sap at the base of the stem. At high numbers, rice dries out and dies in circular patches (hopperburn). They also spread ragged stunt and grassy stunt viruses, which cannot be cured." },
    cekBesok: { id: "Tekuk rumpun lalu ketuk pangkalnya di atas air. Hitung wereng yang jatuh dan bandingkan dengan jumlah laba-laba atau kumbang pemangsa.", en: "Bend a hill and tap its base over the water. Count the hoppers that fall and compare with the number of spiders or predatory beetles." },
    langkahPertama: { id: "Kurangi pupuk nitrogen berlebih, beri pupuk kalium, dan bersihkan gulma. Di persemaian, genangi satu hari hingga hanya ujung bibit yang muncul.", en: "Cut excess nitrogen, apply potassium, and clear weeds. In the nursery, flood for one day until only the seedling tips show." },
    hindari: { id: "Menyemprot terlalu sering membunuh musuh alami sehingga wereng justru meledak (resurgensi). Imidakloprid sudah tidak mempan di banyak populasi wereng di Jawa.", en: "Spraying too often kills natural enemies so planthoppers explode afterwards (resurgence). Imidacloprid no longer works on many planthopper populations in Java." },
  },
  8: {
    bahaya: { id: "Seperti wereng coklat, wereng punggung putih mengisap cairan batang. Dalam jumlah banyak, padi menguning lalu kering.", en: "Like the brown planthopper, it sucks stem sap. In large numbers, rice turns yellow and then dries out." },
    cekBesok: { id: "Periksa pangkal rumpun untuk wereng, bekas telur, embun madu, dan jelaga hitam.", en: "Check the base of the hills for hoppers, egg marks, honeydew, and black sooty mould." },
    langkahPertama: { id: "Bersihkan gulma dan pantau setiap minggu sampai padi matang susu.", en: "Clear weeds and check weekly until the milk stage." },
    hindari: { id: "Bila musuh alami lebih banyak daripada wereng, obat tidak diperlukan.", en: "If natural enemies outnumber the hoppers, no pesticide is needed." },
  },
  9: {
    bahaya: { id: "Wereng ini terutama penting di Asia Timur sebagai penular virus bergaris. Di Indonesia jarang menjadi masalah.", en: "This planthopper matters mainly in East Asia as a carrier of rice stripe virus. It is rarely a problem in Indonesia." },
    cekBesok: { id: "Pastikan jenisnya ke petugas, karena wereng ini mudah tertukar dengan wereng lain.", en: "Confirm the species with an officer, since it is easily confused with other planthoppers." },
    langkahPertama: { id: "Tanam serempak dan bersihkan singgang serta gulma.", en: "Plant at the same time as neighbours and remove ratoons and weeds." },
    hindari: { id: "Jangan menyemprot berdasarkan foto saja; sistem sering keliru untuk hama ini.", en: "Do not spray based on the photo alone; the system is often wrong for this pest." },
  },
  10: {
    bahaya: { id: "Kumbang ini hama invasif: larvanya memakan akar padi dan hasil bisa turun 10 sampai 80 persen. Hama ini belum tercatat di Indonesia, sehingga setiap temuan penting dilaporkan.", en: "This is an invasive weevil: its larvae eat rice roots and yield can drop 10 to 80 percent. It has not been recorded in Indonesia, so any finding should be reported." },
    cekBesok: { id: "Cari goresan memanjang pada daun dan akar yang rusak. Simpan contoh serangganya.", en: "Look for long scrapes on leaves and damaged roots. Keep a specimen." },
    langkahPertama: { id: "Laporkan ke petugas karantina atau POPT, dan jangan memindahkan bibit, gabah, atau jerami dari lahan itu.", en: "Report to quarantine or pest officers, and do not move seedlings, grain, or straw out of that field." },
    hindari: { id: "Jangan membasmi sendiri sebelum jenisnya dipastikan petugas.", en: "Do not try to eradicate it yourself before officers confirm the species." },
  },
  11: {
    bahaya: { id: "Kerugian utama dari wereng hijau bukan dari isapannya, tetapi karena ia menularkan penyakit tungro yang membuat padi kerdil dan daunnya kuning oranye.", en: "The main harm from green leafhoppers is not feeding but spreading tungro disease, which stunts rice and turns leaves yellow-orange." },
    cekBesok: { id: "Hitung wereng hijau per rumpun (ambangnya 5 ekor) dan cari tanaman kerdil berdaun kuning oranye.", en: "Count green leafhoppers per hill (threshold is 5) and look for stunted plants with yellow-orange leaves." },
    langkahPertama: { id: "Tanam serempak, cabut tanaman bergejala tungro, dan jangan mengeringkan sawah agar wereng tidak berpencar.", en: "Plant at the same time as neighbours, remove plants with tungro symptoms, and keep the field flooded so leafhoppers do not scatter." },
    hindari: { id: "Di daerah tanpa sumber tungro, menyemprot wereng hijau tidak diperlukan.", en: "Where there is no tungro source, spraying green leafhoppers is not needed." },
  },
  12: {
    bahaya: { id: "Thrips mengisap daun muda sehingga daun bergaris keperakan dan menggulung, terutama saat kemarau dan sawah tidak tergenang.", en: "Thrips suck young leaves, leaving silvery streaks and rolled leaves, especially in the dry season when fields are not flooded." },
    cekBesok: { id: "Buka gulungan daun bibit muda dan cari serangga kecil memanjang di dalamnya.", en: "Unroll young seedling leaves and look for tiny elongated insects inside." },
    langkahPertama: { id: "Genangi lahan yang terserang selama dua hari.", en: "Flood the affected field for two days." },
    hindari: { id: "Gejalanya mirip kekeringan. Pastikan ada thrips di dalam gulungan sebelum bertindak.", en: "It looks like drought. Confirm thrips inside the rolled leaves before acting." },
  },
  13: {
    bahaya: { id: "Keong mas memotong batang padi muda di pangkalnya, sehingga bibit bisa habis dalam semalam. Masa paling rawan adalah 10 hari setelah tanam pindah atau 21 hari setelah tebar benih.", en: "Golden apple snails cut young rice at the base and can wipe out seedlings overnight. The riskiest period is 10 days after transplanting or 21 days after direct seeding." },
    cekBesok: { id: "Cari telur berwarna merah muda di pematang atau batang, dan potongan daun yang mengapung.", en: "Look for pink egg clusters on bunds or stems and floating pieces of leaves." },
    langkahPertama: { id: "Pungut keong dan hancurkan telurnya bersama-sama satu hamparan, pasang saringan di saluran air masuk, dan buat parit kecil (caren) tempat keong berkumpul.", en: "Collect snails and crush eggs together with neighbours, put a screen on the water inlet, and dig small trenches where snails gather." },
    hindari: { id: "Jangan menebar obat ke seluruh petak; cukup di caren tempat keong berkumpul.", en: "Do not apply molluscicide to the whole plot; only in the trenches where snails gather." },
  },
  14: {
    bahaya: { id: "Ulat menggerek batang jagung sehingga batang mudah patah dan aliran hara terganggu. Kehilangan hasil bisa mencapai 20 sampai 80 persen.", en: "The caterpillar bores into corn stems, so stems break easily and nutrient flow is disrupted. Yield loss can reach 20 to 80 percent." },
    cekBesok: { id: "Cari lubang gerekan berisi kotoran di batang dan kelompok telur seperti sisik ikan di bawah daun, terutama menjelang keluar bunga jantan.", en: "Look for bore holes with droppings on stems and fish-scale egg masses under leaves, especially just before tasselling." },
    langkahPertama: { id: "Manfaatkan parasitoid telur Trichogramma bersama kelompok tani; di lapangan parasitoid ini bisa memarasit hingga 81 persen telur.", en: "Use the egg parasitoid Trichogramma together with your farmer group; in the field it has parasitised up to 81 percent of eggs." },
    hindari: { id: "Ulat yang sudah di dalam batang sulit terkena semprotan; kendalikan sejak fase telur.", en: "Caterpillars already inside the stem are hard to reach; act at the egg stage." },
  },
  15: {
    bahaya: { id: "Ulat memakan daun dari ujung hingga tersisa tulangnya dan bisa memotong bibit. Ledakan sering terjadi setelah kemarau yang diikuti hujan lebat.", en: "The caterpillar eats leaves from the tip until only the midrib is left and can cut seedlings. Outbreaks often follow a dry spell and then heavy rain." },
    cekBesok: { id: "Periksa tanaman pada malam hari atau saat mendung, ketika ulat aktif makan di bagian atas tanaman.", en: "Check plants at night or on cloudy days, when the caterpillars feed on the upper plant." },
    langkahPertama: { id: "Bersihkan gulma di sekitar lahan dan pungut ulat. Agens hayati seperti Bt atau Beauveria efektif saat serangan masih rendah.", en: "Clear weeds around the field and pick caterpillars. Biocontrol such as Bt or Beauveria works well while damage is still low." },
    hindari: { id: "Hama ini berbeda dari ulat grayak jagung invasif (Spodoptera frugiperda). Bila ragu, tanyakan ke petugas.", en: "This is not the invasive fall armyworm (Spodoptera frugiperda). If unsure, ask an officer." },
  },
  16: {
    bahaya: { id: "Koloni kutu mengisap cairan daun dan malai, dan embun madunya memicu jelaga hitam yang mengganggu penyerbukan. Kutu ini juga menularkan virus jagung.", en: "Aphid colonies suck sap from leaves and tassels, and their honeydew causes black sooty mould that hampers pollination. They also spread corn viruses." },
    cekBesok: { id: "Periksa malai dan rambut tongkol saat berbunga, dan lihat apakah sudah banyak kepik atau larva pemangsa di sekitar koloni.", en: "Check tassels and silks at flowering, and see whether ladybirds or predator larvae are already around the colonies." },
    langkahPertama: { id: "Biarkan musuh alami bekerja dan pastikan tanaman cukup air saat fase rambut tongkol.", en: "Let natural enemies work and make sure plants have enough water at silking." },
    hindari: { id: "Semprotan piretroid berspektrum luas membunuh pemangsa kutu sehingga kutu justru bertambah banyak.", en: "Broad-spectrum pyrethroid sprays kill aphid predators, so aphids increase instead." },
  },
  17: ULAT_TANAH,
  18: { ...ULAT_TANAH, hindari: { id: "Sistem sering tertukar antar jenis ulat tanah, tetapi cara pengendaliannya sama. Semprot hanya di titik serangan bila populasi sangat tinggi.", en: "The system often confuses cutworm species, but control is the same. Spot-treat only when numbers are very high." } },
  19: { ...ULAT_TANAH, hindari: { id: "Sistem sering tertukar antar jenis ulat tanah, tetapi cara pengendaliannya sama. Semprot hanya di titik serangan bila populasi sangat tinggi.", en: "The system often confuses cutworm species, but control is the same. Spot-treat only when numbers are very high." } },
  20: {
    bahaya: { id: "Uret memakan akar sehingga tanaman layu, menguning, dan kerdil. Gejalanya sering dikira kekurangan pupuk.", en: "White grubs eat roots, so plants wilt, yellow, and stay stunted. It is often mistaken for nutrient shortage." },
    cekBesok: { id: "Cabut tanaman yang layu dan periksa tanah di sekitar akar: uret berwarna putih dengan tubuh melengkung seperti huruf C.", en: "Pull up a wilted plant and check the soil around the roots: grubs are white and curled into a C shape." },
    langkahPertama: { id: "Gunakan lampu perangkap untuk menangkap kumbang dewasanya, dan lindungi pemangsa alami seperti burung dan katak.", en: "Use light traps to catch the adult beetles, and protect natural predators such as birds and frogs." },
    hindari: { id: "Jangan menambah pupuk untuk tanaman yang layu sebelum memeriksa akarnya.", en: "Do not add fertiliser to wilted plants before checking their roots." },
  },
  21: {
    bahaya: { id: "Orong-orong memakan akar dan memotong pangkal tanaman muda. Pada bawang merah, serangan paling sering terjadi di umur 1 sampai 2 minggu setelah tanam, dan lebih sering pada penanaman kedua.", en: "Mole crickets eat roots and cut young plants at the base. On shallot, attacks peak 1 to 2 weeks after planting, and are more common in the second planting." },
    cekBesok: { id: "Cari tanaman muda yang layu serta lubang atau gundukan tanah kecil di bedengan dan pematang.", en: "Look for wilting young plants and small holes or soil mounds on beds and bunds." },
    langkahPertama: { id: "Genangi lahan 3 sampai 4 hari bila memungkinkan, ratakan tanah, dan kumpulkan orong-orong saat mengolah tanah.", en: "Flood the field for 3 to 4 days if possible, level the soil, and collect mole crickets while tilling." },
    hindari: { id: "Jangan menunggu sampai banyak tanaman layu; pantau sejak minggu pertama setelah tanam.", en: "Do not wait until many plants wilt; start checking from the first week after planting." },
  },
  22: {
    bahaya: { id: "Larva kumbang klik ini melubangi umbi dan memakan benih yang berkecambah, sehingga tanaman jarang dan umbi mudah busuk.", en: "These click-beetle larvae bore into bulbs and eat sprouting seeds, so stands are patchy and bulbs rot easily." },
    cekBesok: { id: "Belah umbi yang rusak dan cari lubang bulat atau terowongan, lalu periksa tanah di sekitarnya.", en: "Cut open damaged bulbs to look for round holes or tunnels, then check the surrounding soil." },
    langkahPertama: { id: "Lakukan rotasi tanaman; ini cara paling penting untuk mencegah uret kawat.", en: "Rotate crops; this is the most important way to prevent wireworms." },
    hindari: { id: "Mengobati setelah kerusakan terlihat biasanya sudah terlambat. Fokuskan pada pencegahan musim berikutnya.", en: "Treating after damage appears is usually too late. Focus on prevention next season." },
  },
  23: {
    bahaya: { id: "Thrips mengisap daun bawang sehingga daun putih keperakan. Serangan hebat bisa membuat seluruh lahan memutih dan tanaman mati, terutama saat cuaca panas dan lembap.", en: "Thrips suck shallot leaves and turn them silvery white. Heavy attacks can whiten the whole field and kill plants, especially in hot, humid weather." },
    cekBesok: { id: "Periksa daun bawang umur 5 sampai 9 minggu: cari bercak keperakan dan serangga sangat kecil di sela daun.", en: "Check shallots 5 to 9 weeks old: look for silvery patches and tiny insects between the leaves." },
    langkahPertama: { id: "Pasang perangkap likat putih atau biru, sekitar 50 buah per hektare.", en: "Set up white or blue sticky traps, about 50 per hectare." },
    hindari: { id: "Sistem sering keliru mengenali thrips bawang. Cocokkan dulu dengan daun di lahan sebelum bertindak.", en: "The system often misidentifies onion thrips. Check the leaves in the field before acting." },
  },
};
