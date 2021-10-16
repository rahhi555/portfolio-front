<template>
  <v-sheet height="400">
    <v-calendar ref="calendar" color="primary" type="day" :events="events" event-text-color="#333">
      <template #interval="{ hour }">
        <div class="text-center text-caption">{{ hour }} 時</div>
      </template>

      <template #day-body="{ date, week }">
        <div
          class="v-current-time"
          :class="{ first: date === week[0].date }"
          :style="{ top: nowY }"
        ></div>
      </template>
    </v-calendar>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent, useContext, computed } from '@nuxtjs/composition-api'
import { Todo } from 'interface'

export default defineComponent({
  props: {
    todos: {
      type: Array,
      default: null
    }
  },

  setup(props) {
    const { $dayjs } = useContext()

    const svgAttachedTodos = props.todos.flatMap(todo => todo) as Todo[]
    const today = $dayjs().format('YYYY-MM-DD')
    const getColor = (status: 'todo' | 'doing' | 'done') => {
      let color = ''
      switch (status) {
        case 'todo':
          color = '#cccccc'
          break;
        case 'doing':
          color = '#E6EE9C'
          break;
        case 'done':
          color = '#66BB6A'
          break;
      }
      return color
    }
    const events = computed(() => {
      return svgAttachedTodos.map((todo) => ({
        name: todo?.title,
        start: `${today} ${todo?.beginTime}:00`,
        end: `${today} ${todo?.endTime}:00`,
        timed: true,
        color: getColor(todo?.status!)
      }))
    })

    return {
      events,
    }
  },

  // ここから以下はデフォルト設定
  data: () => ({
    value: '',
    ready: false,
  }),
  computed: {
    // @ts-ignore
    cal() {
      // @ts-ignore
      return this.ready ? this.$refs.calendar : null
    },
    // @ts-ignore
    nowY() {
      // @ts-ignore
      return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
    },
  },
  mounted() {
    this.ready = true
    this.scrollToTime()
    this.updateTime()
  },
  methods: {
    getCurrentTime() {
      return this.cal
        ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
        : 0
    },
    scrollToTime() {
      const time = this.getCurrentTime()
      const first = Math.max(0, time - (time % 30) - 30)
      this.cal.scrollToTime(first)
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000)
    },
  },
})
</script>

<style lang="sass">
.v-current-time
  height: 2px
  background-color: #ea4335
  position: absolute
  left: -1px
  right: 0
  pointer-events: none

  &.first::before
    content: ''
    position: absolute
    background-color: #ea4335
    width: 12px
    height: 12px
    border-radius: 50%
    margin-top: -5px
    margin-left: -6.5px

.v-calendar
  .v-event, .v-event-timed
    max-width: 100px
    display: inline-flex
    border: solid 1px #333 !important
  .v-event
    font-size: 1rem !important
    margin-right: 5px !important
</style>
