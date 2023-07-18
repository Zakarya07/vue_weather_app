<template>
  <div v-for="city in saved_cities" :key="city.id">
    <CityCard :city="city" @click="goToCityView(city)" />
  </div>

  <p v-if="saved_cities.length === 0">No locations added. To start tracking a location, search in the field above.</p>

</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CityCard from "./CityCard.vue";

const saved_cities = ref([]);
const getCities = async () => {
  if (localStorage.getItem("saved_cities")) {
    saved_cities.value = JSON.parse(localStorage.getItem("saved_cities"));

    const requests = [];

    saved_cities.value.forEach((city) => {
      requests.push(
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=imperial`
        )
      );
    });

    const weatherData = await Promise.all(requests);
    
  // flicker delay
  await new Promise((res) => setTimeout(res, 500))

    weatherData.forEach((value, index) => {
      saved_cities.value[index].weather = value.data;
    });
  }
};

await getCities();

const router = useRouter();

const goToCityView = (city) =>{
    router.push({
        name: "cityView",
        params: { state: city.state, city: city.city },
        query: {
            id: city.id,
            lat: city.coords.lat,
            lng: city.coords.lng,
        },
    })
}
</script>
