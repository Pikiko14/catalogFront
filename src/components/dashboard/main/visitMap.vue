<template>
  <section class="full-width">
    <div id="map" class="map"></div>
  </section>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

export default defineComponent({
  name: 'VisitMapMain',
  props: {
    lat: {
      type: String,
      default: () => '5.2693423,',
    },
    lng: {
      type: String,
      default: () => '-74.5858259',
    },
    visits: {
      type: Array as () => any,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    // const
    const map = ref(null);

    // watch
    watch(
      () => {
        return props.visits;
      },
      async () => {
        await runGoogleMap();
      }
    );

    // methods
    const runGoogleMap = async () => {
      const loader = new Loader({
        apiKey: 'AIzaSyC62qW1RdPQLPCGgL3MwzFjl43mEjk5cd0',
        version: 'weekly',
        libraries: ['places'],
      });
      const lat = parseFloat(props.lat);
      const lng = parseFloat(props.lng);
      const mapOptions = {
        center: {
          lat: lat,
          lng: lng,
        },
        zoom: 6,
      };
      const mapDiv = document.getElementById('map');
      loader
        .load()
        .then((google: any) => {
          const map = new google.maps.Map(mapDiv as HTMLElement, mapOptions);
          // Agregar el marcador al mapa
          const markerIcon = {
            //url: '/images/marker.svg',
            scaledSize: new google.maps.Size(50, 40),
          };
          if (props.visits && props.visits.length > 0) {
            for (const visit of props.visits) {
              const position = {
                lat: parseFloat(visit.lat),
                lng: parseFloat(visit.long),
              };
              new google.maps.Marker({
                position: position,
                map,
                icon: markerIcon,
                zIndex: 2,
              });
            }
          }
        })
        .catch((e: any) => {
          // do something
          console.log(e);
        });
    };

    // life cycle

    // return statement
    return {
      map,
    };
  },
});
</script>
