<template>
  <v-container
    id="register-view"
    class="fill-height"
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="9"
      >
        <v-slide-y-transition appear>
          <v-card
            class="pa-3 pa-md-10 mx-sm-auto"
            light
          >
            <h1 class="text-center text-h2 font-weight-light">
              Register
            </h1>

            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-row no-gutters>
                  <v-col
                    v-for="(section, i) in sections"
                    :key="i"
                    cols="12"
                  >
                    <v-list-item three-line>
                      <v-list-item-icon class="mr-4 mt-5 mt-md-4">
                        <v-icon
                          :color="section.iconColor"
                          :large="$vuetify.breakpoint.mdAndUp"
                          v-text="section.icon"
                        />
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title
                          class="text-h4 mb-4 mt-3"
                          v-text="section.title"
                        />

                        <v-list-item-subtitle
                          class="text--secondary"
                          v-text="section.text"
                        />
                      </v-list-item-content>
                    </v-list-item>
                  </v-col>
                </v-row>
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <div class="text-center">
                  <v-btn
                    v-for="(social, i) in socials"
                    :key="i"
                    :color="social.iconColor"
                    class="my-2 mr-1"
                    dark
                    depressed
                    fab
                    small
                  >
                    <v-icon v-text="social.icon" />
                  </v-btn>

                  <div class="my-2" />

                  <div class="text-center text-h4">
                    or be classical
                  </div>

                  <v-text-field
                    color="secondary"
                    placeholder="First Name..."
                    prepend-icon="mdi-face"
                  />

                  <v-text-field
                    color="secondary"
                    placeholder="Email..."
                    prepend-icon="mdi-email"
                  />

                  <v-text-field
                    class="mb-8"
                    color="secondary"
                    placeholder="Password..."
                    prepend-icon="mdi-lock-outline"
                  />

                  <v-checkbox
                    :input-value="true"
                    color="secondary"
                  >
                    <template #label>
                      <span class="text-no-wrap">I agree to the</span>

                      <a
                        class="secondary--text ml-6 ml-sm-1 d-inline-block"
                        href="#"
                      >
                        terms and conditions
                      </a>.
                    </template>
                  </v-checkbox>

                  <v-btn
                    color="secondary"
                    depressed
                    min-width="140"
                    rounded
                  >
                    Get Started
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-slide-y-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'RegisterView',
    layout: 'unProtected',
    data: () => ({
      sections: [
        {
          icon: 'mdi-chart-timeline-variant',
          iconColor: 'primary',
          title: 'Marketing',
          text: 'We\'ve created the marketing campaign of the website. It was a very interesting collaboration.',
        },
        {
          icon: 'mdi-code-tags',
          iconColor: 'secondary',
          title: 'Fully Coded in HTML5',
          text: 'We\'ve developed the website with HTML5 and CSS3. The client has access to the code using GitHub.',
        },
        {
          icon: 'mdi-account-multiple',
          iconColor: 'cyan',
          title: 'Built Audience',
          text: 'There is also a Fully Customizable CMS Admin Dashboard for this product.',
        },
      ],
      socials: [
        {
          href: '#',
          icon: 'mdi-twitter',
          iconColor: '#1DA1F2',
        },
        {
          href: '#',
          icon: 'mdi-github',
          iconColor: '#24292E',
        },
        {
          href: '#',
          icon: 'mdi-facebook',
          iconColor: '#3B5998',
        },

      ],
    }),
  }
</script>

<style scoped lang="sass">
#register-view
  .v-list-item__subtitle
    -webkic-line-clamp: initial
    -webkit-box-orient: initial

  .v-list-item__title
    font-size: 1.12rem

  .v-list-item__subtitle
    font-size: .875rem
    color: #3C4858
    line-height: 1.5em
    font-weight: 300
</style>
