<template>
  <div class="w-full max-w-5xl mx-auto p-6 md:p-8 bg-[#f8fafc] text-slate-800">
    
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4">
      <div>
        <span class="text-xs font-bold text-blue-900 uppercase tracking-wider">Krok 4 z 10</span>
        <h1 class="text-3xl font-bold text-[#1e293b] mt-1">Wybór Dokumentu i Szkoły</h1>
      </div>
      <div class="flex flex-col items-end gap-1">
        <span class="text-xs text-gray-500 font-medium">Postęp aplikacji</span>
        <div class="w-40 bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div class="bg-[#11224d] h-full w-2/5"></div>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h2 class="text-lg font-bold text-[#1e293b]">Szkoła Ponadpodstawowa</h2>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">Wyszukaj szkołę średnią</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              v-model="formData.school"
              type="text" 
              placeholder="Wpisz nazwę, miasto lub kod szkoły..." 
              class="w-full pl-11 pr-4 py-3 bg-[#e2e8f0]/50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition placeholder-gray-400 text-sm"
            />
          </div>
          <p class="text-xs text-gray-400 italic mt-1">
            Jeśli Twojej szkoły nie ma na liście, skontaktuj się z biurem rekrutacji.
          </p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h2 class="text-lg font-bold text-[#1e293b]">Typ Dokumentu</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700">Rodzaj świadectwa maturalnego</label>
            <div class="relative">
              <select 
                v-model="formData.maturityType"
                class="w-full px-4 py-3 bg-[#e2e8f0]/50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition appearance-none text-sm text-gray-700 cursor-pointer"
              >
                <option value="" disabled selected>Wybierz typ matury...</option>
                <option value="stara">Stara matura (do 2004 r.)</option>
                <option value="nowa">Nowa matura (od 2005 r.)</option>
                <option value="miedzynarodowa">Matura Międzynarodowa (IB)</option>
              </select>
              <span class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700">Kraj wydania dokumentu</label>
            <div class="relative">
              <input 
                type="text" 
                value="Polska" 
                disabled
                class="w-full pl-4 pr-11 py-3 bg-[#e2e8f0]/50 border border-transparent rounded-xl text-sm text-gray-500 cursor-not-allowed font-medium"
              />
              <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 class="text-lg font-bold text-[#1e293b]">Szczegóły Świadectwa</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700">Numer Dokumentu</label>
            <input 
              v-model="formData.docNumber"
              type="text" 
              placeholder="np. ABC 123456" 
              class="w-full px-4 py-3 bg-[#e2e8f0]/50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition placeholder-gray-400 text-sm"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700">Rok Wydania</label>
            <input 
              v-model="formData.docYear"
              type="text" 
              placeholder="2024" 
              class="w-full px-4 py-3 bg-[#e2e8f0]/50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition placeholder-gray-400 text-sm"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700">Organ Wydający</label>
            <input 
              v-model="formData.docIssuer"
              type="text" 
              placeholder="np. OKE w Poznaniu" 
              class="w-full px-4 py-3 bg-[#e2e8f0]/50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition placeholder-gray-400 text-sm"
            />
          </div>
        </div>

        <div class="flex items-start gap-3 bg-[#e2e8f0]/40 p-4 rounded-xl border border-gray-200/50">
          <span class="text-slate-700 mt-0.5 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <p class="text-xs text-gray-600 leading-relaxed">
            Prosimy o dokładne wprowadzenie danych zgodnie z oryginałem świadectwa. Błędne dane mogą skutkować odrzuceniem wniosku na etapie weryfikacji dokumentów papierowych.
          </p>
        </div>
      </div>

      <div class="flex justify-between items-center pt-4">
        <button 
          type="button" 
          @click="handleBack"
          class="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Wstecz
        </button>

        <button 
          type="submit" 
          class="flex items-center gap-2 px-6 py-3 bg-[#11224d] text-sm font-semibold text-white rounded-xl hover:bg-[#1a316c] active:bg-[#0b1633] transition shadow-md"
        >
          Zapisz i kontynuuj
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

// Model danych formularza zgodny z inputami na makiecie
const formData = reactive({
  school: '',
  maturityType: '',
  docNumber: '',
  docYear: '',
  docIssuer: ''
})

// Logika zapisu / przejścia dalej
const handleSubmit = () => {
  console.log('Zapisywanie danych kroku 4:', { ...formData, country: 'Polska' })
  // Tutaj dodaj logikę przejścia do kroku 5 (np. router.push lub emit)
}

// Logika powrotu
const handleBack = () => {
  console.log('Powrót do kroku 3')
  // Tutaj dodaj logikę cofania
}
</script>