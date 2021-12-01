<template>
  <v-footer id="default-footer" color="transparent" absolute app inset>
    <v-container>
      <v-row align="center">
        <v-col
          v-for="(link, i) in links"
          :key="i"
          class="text-center"
          cols="6"
        >
          <a
            :href="link.href"
            class="
              text-decoration-none text-uppercase text-caption
              font-weight-regular
            "
            rel="noopener"
            target="_blank"
            v-text="link.text"
          />
        </v-col>

        <v-spacer class="hidden-sm-and-down" />

        <v-col cols="12">
          <div class="text-body-1 font-weight-light pt-6 pt-md-0 text-center">
            &copy; {{ new Date().getFullYear() }}, Made by
            <v-icon>mdi-vuetify</v-icon>
            <a
              href="https://vuetifyjs.com/en/about/meet-the-team/#company"
              class="text-decoration-none"
              >Vuetify</a
            >
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({
      links: [
        {
          href: '#',
          text: 'About Us',
        },
      ],
    }),
  }
</script>

<style scoped lang="sass">
  a
    color: inherit !important
</style>
