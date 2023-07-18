<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input 
      type="text" 
      placeholder="Search for a city or state" 
      @input="getSearchResults"
      v-model="search_query"
      class="py-2 px-1 w-full bg-transparent border-b O focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]">
      <ul class="absolute bg-weather-secondary text-white w-full shadow-md p-2 top-[66px]" v-if="mapbox_search_results">
        <!-- If something went wrong -->
        <p v-if="search_error" class="">sorry, something went wrong, please try again.</p>
        <!-- If there is no city that the user entered -->
        <p v-if="!serverError && mapbox_search_results.length === 0" class="">No results match your query, try a different term.</p>
        <template v-else>
          <li v-for="search_result in mapbox_search_results" :key="search_result.id" class="py_2 cursor-pointer" @click="previewCity(search_result)">
            {{ search_result.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList /> 
        <template #fallback>
         <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import CityCardSkeleton from "../components/CityCardSkeleton.vue";	
import CityList from "../components/CityList.vue";

const router = useRouter();

const previewCity = ( search_result ) => {

  const [ city, state ] = search_result.place_name.split(",");
  router.push({
    name: "cityView",
    params:{
      state: state.replaceAll(" ", ""),
      city: city
    },
    query : {
      lat: search_result.geometry.coordinates[1],
      lng: search_result.geometry.coordinates[0],
      preview: true,
    }
   })
}
 
const mapbox_api_key = "pk.eyJ1Ijoiam9obmtvbWFybmlja2kiLCJhIjoiY2t5NjFzODZvMHJkaDJ1bWx6OGVieGxreSJ9.IpojdT3U3NENknF6_WhR2Q";
const search_query = ref("");
const mapbox_search_results = ref(null);
const query_timeout = ref(null);
const search_error = ref(null);

const getSearchResults = () => {
  clearTimeout(query_timeout.value);

  query_timeout.value = setTimeout( async () => {

    if (search_query.value !== "") {
      try {

        const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search_query.value}.json?access_token=${mapbox_api_key}&types=place`)
        mapbox_search_results.value = result.data.features;

      } catch {
        search_error.value = true;
      }
      return;
    }
      mapbox_search_results.value = null;

  }, 200)

}

</script>
