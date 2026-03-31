# IRK - Frontend (Vue 3)

## Spis treści

- [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
- [Dokumentacja Vue.js](#dokumentacja-vuejs)
- [Architektura routingu (File-based)](#architektura-routingu-file-based)
- [TypeScript](#typescript)
- [Komunikacja z API (Axios)](#komunikacja-z-api-axios)
- [Zarządzanie stanem (Pinia)](#zarządzanie-stanem-pinia)
- [Tłumaczenia (vue-i18n)](#tłumaczenia-vue-i18n)
- [Interfejs użytkownika (PrimeVue)](#interfejs-użytkownika-primevue)
- [Walidacja danych (Zod)](#walidacja-danych-zod)
- [Jakość kodu i formatowanie](#jakość-kodu-i-formatowanie)
- [Testy jednostkowe (Vitest)](#testy-jednostkowe-vitest)

<br>

## Instalacja i uruchomienie

**1. Wymagania systemowe**
- Zainstalowany **Node.js**.
- Rekomendowany menedżer pakietów: **npm**.

**2. Pobranie projektu i instalacja zależności**

```bash
# Klonowanie projektu
git clone https://github.com/2moki/irk-frontend irk-frontend

# Przejście do katalogu
cd irk-frontend

# Instalacja paczek
npm install
```

**3. Uruchomienie trybu developerskiego**

```bash
# Uruchomienie trybu deweloperskiego
npm run dev
```

Aplikacja domyślnie będzie dostępna pod adresem: http://localhost:5173.

<br>

## Dokumentacja Vue.js

Projekt oparty jest o Vue 3 w wersji produkcyjnej, korzystający z **Composition API** oraz `<script setup>`.
- Oficjalna dokumentacja: https://vuejs.org/

<br>

## Architektura routingu (File-based)

W projekcie wykorzystywany jest file-based routing. Oznacza to, że struktura plików w katalogu src/pages/ automatycznie definiuje ścieżki w przeglądarce.

Przykład na podstawie struktury plików:
- pages/index.vue → ścieżka /
- pages/auth/login.vue → ścieżka /auth/login
- pages/auth/index.vue → ścieżka /auth
- pages/[...path].vue → obsługa błędów 404 (catch-all)

#### Struktura katalogu pages/ i obsługa layoutów

Wykorzystanie folderów w nawiasach (np. (main), (auth)) służy do grupowania plików bez wpływu na strukturę adresów URL. Przykładowo, plik zlokalizowany w pages/(main)/about.vue jest dostępny pod adresem /about.

W celu zapewnienia pełnej kontroli nad renderowaniem i uniknięcia konfliktów priorytetów, zrezygnowano z automatycznych layoutów opartych na systemie plików. Wybór layoutu odbywa się jawnie poprzez pole meta.layout wewnątrz komponentu strony:

```js
<script setup lang="ts">
definePage({
    meta: {
        layout: 'auth', // domyślnie używany jest 'main'
    },
});
</script>
```

W przypadku chęci użycia domyślnego layoutu (`MainLayout`) nie ma potrzeby korzystania z powyższego kodu.

Wszystkie komponenty layoutów znajdują się w dedykowanym katalogu `src/layouts/`.

- Dokumentacja: https://router.vuejs.org/file-based-routing/file-based-routing.html

<br>

## TypeScript

Projekt jest w pełni otypowany, co pozwala wyłapywać błędy na etapie pisania kodu i korzystać z podpowiedzi w IDE.

- Aby sprawdzić poprawność typów w całej aplikacji, na przykład przed budowaniem wersji produkcyjnej, należy użyć komendy komendy `npm run type-check`.
- Należy starać się unikać stosowania typu `any`, stawiając na jasne definicje interfejsów i typów dla wszystkich danych krążących w systemie.
- Dokumentacja: https://www.typescriptlang.org/docs/

<br>

## Komunikacja z API (Axios)

Do obsługi zapytań HTTP zainstalowano bibliotekę Axios. Jest ona skonfigurowana tak, aby bezproblemowo współpracować z backendem Laravelowym.

- Dokumentacja: https://axios-http.com/docs/intro

<br>

## Zarządzanie stanem (Pinia)
Pinia służy do zarządzania globalnym stanem aplikacji, dzięki czemu kluczowe dane (np. sesja użytkownika) nie „uciekają” podczas przechodzenia między widokami i są łatwo dostępne w każdym komponencie.
- Dokumentacja: https://pinia.vuejs.org/introduction.html

<br>

## Tłumaczenia (vue-i18n)
Wszystkie teksty w aplikacji są obsługiwane przez system tłumaczeń. Pliki znajdują się w:

- src/locales/pl.json
- src/locales/en.json

Konwencja i wywołanie:
1. Należy stosować camelCase dla kluczy oraz grupowanie tematyczne (np. `auth.login.button`).
2. Wywołanie w kodzie: $t('klucz') w template.
- Dokumentacja: https://vue-i18n.intlify.dev/guide/essentials/started.html

<br>

## Interfejs użytkownika (PrimeVue)
Jako w projekcie zainstalowana jest biblioteka komponentów PrimeVue, co pozwala na szybkie budowanie spójnych wizualnie i dostępnych interfejsów.
- Dokumentacja: https://primevue.org/

<br>

## Walidacja danych (Zod)
Zod służy do deklaratywnej walidacji schematów danych, zapewniając bezpieczeństwo typów (TypeScript) przy walidacji formularzy i komunikacji z API.

Przeznaczony do wykorzystania jako resolver w PrimeVue Forms (https://primevue.org/forms/#resolvers).
- Dokumentacja: https://zod.dev/

<br>

## Jakość kodu i formatowanie
W celu zachowania spójności kodu w zespole, w projekcie zainstalowano następujące narzędzia:

1. ESLint & Oxlint - Statyczna analiza kodu.
- Wywołanie: `npm run lint`
- Dokumentacja ESLint: https://eslint.org/

2. Prettier - Automatyczne formatowanie kodu.
- Wywołanie: `npm run format`
- Dokumentacja Prettier: https://prettier.io/

#### Ważne!
Przed wysłaniem zmian na repozytorium należy upewnić się, że kod przechodzi weryfikację i jest poprawnie sformatowany. Dobrą praktyką przed każdym utworzeniem commit'a jest użycie `npm run format`, następnie `npm run lint`, a w przypadku wykrycia błędów, rozwiązanie ich i powtórzenie wcześniejszych kroków.

<br>

## Testy jednostkowe (Vitest)

W projekcie zainstalowany jest pakiet Vitest, służący do pisania testów jednostkowych dla komponentów i logiki.
- Wszystkie przygotowane testy można uruchomić za pomocą komendy `npm run test:unit`.
- Dokumentacja: https://vitest.dev/guide/
