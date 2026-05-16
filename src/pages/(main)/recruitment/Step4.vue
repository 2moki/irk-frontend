<template>
  <div class="w-full max-w-5xl mx-auto p-6 md:p-8 bg-[#f8fafc] dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-200">
    
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4">
      <div>
        <span class="text-xs font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wider">Krok 4 z 10</span>
        <h1 class="text-3xl font-bold text-[#1e293b] dark:text-white mt-1">Wybór Dokumentu i Szkoły</h1>
      </div>
      <div class="flex flex-col items-end gap-1">
        <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">Postęp aplikacji</span>
        <div class="w-40 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
          <div class="bg-[#11224d] dark:bg-blue-600 h-full w-2/5"></div>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h2 class="text-lg font-bold text-[#1e293b] dark:text-white">Szkoła Ponadpodstawowa</h2>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Wyszukaj szkołę średnią</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              v-model="formData.school"
              type="text" 
              placeholder="Wpisz nazwę, miasto lub kod szkoły..." 
              class="w-full pl-11 pr-4 py-3 bg-[#e2e8f0]/50 dark:bg-slate-700/50 border border-transparent dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition placeholder-gray-400 dark:placeholder-gray-500 text-sm text-slate-800 dark:text-white"
            />
          </div>
          <p class="text-xs text-gray-400 dark:text-gray-500 italic mt-1">
            Jeśli Twojej szkoły nie ma na liście, skontaktuj się z biurem rekrutacji.
          </p>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h2 class="text-lg font-bold text-[#1e293b] dark:text-white">Typ Dokumentu</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Rodzaj świadectwa maturalnego</label>
            <div class="relative">
              <select 
                v-model="formData.maturityType"
                class="w-full px-4 py-3 bg-[#e2e8f0]/50 dark:bg-slate-700/50 border border-transparent dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition appearance-none text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                <option value="" disabled class="dark:bg-slate-800">Wybierz typ matury...</option>
                <option value="nowa_2023" class="dark:bg-slate-800">Nowa matura (Formuła 2023)</option>
                <option value="nowa_2015" class="dark:bg-slate-800">Nowa matura (Formuła 2015)</option>
                <option value="stara" class="dark:bg-slate-800">Stara matura (skala ocen, do 2004 r.)</option>
                <option value="ib" class="dark:bg-slate-800">Matura Międzynarodowa (IB)</option>
                <option value="eb" class="dark:bg-slate-800">Matura Europejska (EB)</option>
                <option value="zagraniczna" class="dark:bg-slate-800">Świadectwo uzyskane za granicą</option>
              </select>
              <span class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Kraj wydania dokumentu</label>
            <div class="relative">
              <input 
                type="text" 
                value="Polska" 
                disabled
                class="w-full pl-4 pr-11 py-3 bg-[#e2e8f0]/50 dark:bg-slate-700/30 border border-transparent dark:border-slate-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed font-medium"
              />
              <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 dark:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 class="text-lg font-bold text-[#1e293b] dark:text-white">Szczegóły Świadectwa</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Numer Dokumentu</label>
            <input 
              v-model="formData.docNumber"
              type="text" 
              placeholder="np. ABC 123456" 
              class="w-full px-4 py-3 bg-[#e2e8f0]/50 dark:bg-slate-700/50 border border-transparent dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition placeholder-gray-400 dark:placeholder-gray-500 text-sm text-slate-800 dark:text-white"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Rok Wydania</label>
            <input 
              v-model="formData.docYear"
              type="text" 
              placeholder="2024" 
              class="w-full px-4 py-3 bg-[#e2e8f0]/50 dark:bg-slate-700/50 border border-transparent dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition placeholder-gray-400 dark:placeholder-gray-500 text-sm text-slate-800 dark:text-white"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Organ Wydający</label>
            <input 
              v-model="formData.docIssuer"
              type="text" 
              placeholder="np. OKE w Poznaniu" 
              class="w-full px-4 py-3 bg-[#e2e8f0]/50 dark:bg-slate-700/50 border border-transparent dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition placeholder-gray-400 dark:placeholder-gray-500 text-sm text-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div class="flex items-start gap-3 bg-[#e2e8f0]/40 dark:bg-slate-700/30 p-4 rounded-xl border border-gray-200/50 dark:border-slate-700">
          <span class="text-slate-700 dark:text-slate-300 mt-0.5 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Prosimy o dokładne wprowadzenie danych zgodnie z oryginałem świadectwa. Błędne dane mogą skutkować odrzuceniem wniosku na etapie weryfikacji dokumentów papierowych.
          </p>
        </div>
      </div>

      <div class="flex justify-between items-center pt-4">
        <button 
          type="button" 
          @click="handleBack"
          class="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 dark:active:bg-slate-600 transition shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Wstecz
        </button>

        <button 
          type="submit" 
          class="flex items-center gap-2 px-6 py-3 bg-[#11224d] dark:bg-blue-600 text-sm font-semibold text-white rounded-xl hover:bg-[#1a316c] dark:hover:bg-blue-500 active:bg-[#0b1633] dark:active:bg-blue-700 transition shadow-md"
        >
          Zapisz i kontynuuj
          <svg xmlns="http://www.w3.org/2000/xl" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Jeśli używasz routera do przechodzenia między krokami
import { useApplicationStore } from '@/stores/application';

const applicationStore = useApplicationStore();
const router = useRouter();

const formData = reactive({
  school: '',
  maturityType: '',
  docNumber: '',
  docYear: '',
  docIssuer: ''
});

// Wczytanie danych z Pinia (która pobrała je z localStorage) przy wejściu na krok
onMounted(() => {
  if (applicationStore.step4Data) {
    Object.assign(formData, applicationStore.step4Data);
  }
});

const handleSubmit = () => {
  // Zapis do Pinia
  applicationStore.updateStep4(formData);
  
  // Przejście do kroku 5
  // router.push({ name: 'Step5' });
};

const handleBack = () => {
  // Opcjonalnie zapisujemy nawet jak wraca, żeby nie stracić tego co wpisał
  applicationStore.updateStep4(formData);
  // router.push({ name: 'Step3' });
};
</script>