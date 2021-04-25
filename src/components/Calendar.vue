<template>
  <v-container class="mt-6">
    <v-row class="text-center">
      <v-col cols="12">
        <vue-cal
          locale="pt-br"
          class="container"
          :disable-views="['years', 'year']"
          @view-change="updateCalendar"
          @ready="updateCalendar"
          :events="events"
          :editable-events="{
            title: false,
            drag: false,
            resize: false,
            delete: false,
            create: false,
          }"
          :drag-to-create-threshold="0"
        >
        </vue-cal>

        <v-btn class="mt-10" @click="dialog = true">
          Adicionar Atividade
        </v-btn>
        <v-dialog
          v-model="dialog"
          transition="dialog-bottom-transition"
          scrollable
          max-width="900"
        >
          <v-card tile>
            <v-toolbar max-height="80" color="#48447f">
              <v-toolbar-title class="text-color-white"
                >Criação de atividade esportiva</v-toolbar-title
              >
              <v-spacer></v-spacer>
              <v-btn icon dark @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <label class="ml-1 font-weight-medium">Evento</label>
                      <v-text-field
                        v-model="newEvent.name"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col class="mt-n8" cols="12">
                      <label class="ml-1 font-weight-medium">Descrição</label>
                      <v-textarea
                        v-model="newEvent.description"
                        outlined
                      ></v-textarea>
                    </v-col>

                    <v-col class="mt-n8" cols="8">
                      <v-row>
                        <v-col cols="4">
                          <!-- date field -->
                          <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="newEvent.start_date"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <label class="ml-1 font-weight-medium">De:</label>
                              <v-text-field
                                v-model="brDateText"
                                outlined
                                flat
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              color="#48447f"
                              locale="pt-br"
                              v-model="newEvent.start_date"
                              no-title
                              scrollable
                            >
                              <v-spacer></v-spacer>
                              <v-btn text color="primary" @click="menu = false">
                                Cancelar
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.menu.save(newEvent.start_date)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-menu>

                          <!-- hour fields -->
                          <v-row>
                            <v-col col="6">
                              <v-menu
                                ref="startMenu"
                                v-model="startMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="newEvent.start_time"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <label class="ml-1 font-weight-medium">
                                    Inicio:
                                  </label>
                                  <v-text-field
                                    v-model="newEvent.start_time"
                                    outlined
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-time-picker
                                  v-if="startMenu"
                                  color="#48447f"
                                  format="24hr"
                                  v-model="newEvent.start_time"
                                  :max="newEvent.end_time"
                                  full-width
                                  @click:minute="
                                    $refs.startMenu.save(newEvent.start_time)
                                  "
                                ></v-time-picker>
                              </v-menu>
                            </v-col>
                            <v-col col="6">
                              <v-menu
                                ref="endMenu"
                                v-model="endMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="newEvent.end_time"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <label class="ml-1 font-weight-medium"
                                    >Fim:</label
                                  >
                                  <v-text-field
                                    v-model="newEvent.end_time"
                                    outlined
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-time-picker
                                  v-if="endMenu"
                                  format="24hr"
                                  color="#48447f"
                                  v-model="newEvent.end_time"
                                  :min="newEvent.start_time"
                                  full-width
                                  @click:minute="
                                    $refs.endMenu.save(newEvent.end_time)
                                  "
                                ></v-time-picker>
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="4">
                          <v-radio-group v-model="repeat" mandatory>
                            <v-radio
                              label="Não se repete"
                              :value="false"
                            ></v-radio>
                            <v-radio label="Repetir" :value="true"></v-radio>
                          </v-radio-group>
                          <div v-if="repeat">
                            <label>Intervalo de semanas {{ weeks }}</label>
                            <v-slider
                              color="#48447f"
                              track-color="grey"
                              v-model="weeks"
                              step="1"
                              thumb-label
                            ></v-slider>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <div class="full-width position-relative">
                    <v-btn @click="save" class="float-right " color="#48447f">
                      <span class="text-color-white">Salvar</span>
                    </v-btn>
                  </div>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import {
  lastDayOfActivity,
  getMonthIntervalFromDate,
} from '../utils/dateHelper';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import 'vue-cal/dist/i18n/pt-br.js';

export default {
  name: 'HelloWorld',
  components: { VueCal },
  data: () => ({
    dialog: false,
    menu: false,
    startMenu: false,
    endMenu: false,
    repeat: false,
    weeks: 0,
    newEvent: {
      name: '',
      description: '',
      start_time: null,
      end_time: null,
      start_date: '',
      end_date: null,
      weekday: null,
    },
  }),
  created() {
    const today = new Date();
    const interval = getMonthIntervalFromDate(today);

    this.SET_CURRENT_MONTH(today.getMonth());
    this.SET_CURRENT_YEAR(today.getFullYear());
    this.SET_CURRENT_DATE_INTERVAL(interval);

    this.fetchActivities(interval);
  },
  computed: {
    ...mapGetters({
      events: 'getActivities',
      getCurrentMonth: 'getCurrentMonth',
      getCurrentYear: 'getCurrentYear',
    }),
    brDateText() {
      return this.newEvent.start_date
        .split('-')
        .reverse()
        .join('/');
    },
  },
  methods: {
    ...mapActions({
      addActivity: 'addActivity',
      fetchActivities: 'fetchActivities',
    }),
    ...mapMutations({
      SET_CURRENT_MONTH: 'SET_CURRENT_MONTH',
      SET_CURRENT_YEAR: 'SET_CURRENT_YEAR',
      SET_CURRENT_DATE_INTERVAL: 'SET_CURRENT_DATE_INTERVAL',
    }),
    async save() {
      //calculate last date
      this.newEvent.start_date
        ? (this.newEvent.end_date = lastDayOfActivity(
            this.newEvent.start_date,
            this.weeks
          ))
        : null;

      //get in what weekday the event was created (monday, tuesday, ...)
      let weekdayHandler = this.newEvent.start_date.split('-');
      this.newEvent.weekday = new Date(
        weekdayHandler[0],
        weekdayHandler[1] - 1,
        weekdayHandler[2]
      ).getDay();

      await this.addActivity(this.newEvent);
      this.dialog = false;
    },
    //responsible to bring new events to calendar when the calendar's view change
    updateCalendar(event) {
      //verify if the month has changed
      const monthChanged = event.startDate.getMonth() !== this.getCurrentMonth;
      
      //get calendar's view date interval. 
      //In case of a view of type week, it uses the first and last day 
      //of the week and gets the month interval which each day belongs  
      const intervalStart = getMonthIntervalFromDate(event.startDate);
      const intervalEnd = getMonthIntervalFromDate(event.endDate);
      
      this.SET_CURRENT_DATE_INTERVAL([intervalStart[0], intervalEnd[1]]);
      
      //case when week is between to months
      if (event.startDate.getMonth() !== event.endDate.getMonth()) {
        this.SET_CURRENT_MONTH(event.startDate.getMonth());
        this.SET_CURRENT_YEAR(event.startDate.getFullYear());
        
        //fetch the events of both months
        this.fetchActivities([intervalStart[0], intervalEnd[1]]);
      } else {
        if ((event.view !== 'month' && !monthChanged) || !monthChanged) return;

        this.SET_CURRENT_MONTH(event.startDate.getMonth());
        this.SET_CURRENT_YEAR(event.startDate.getFullYear());
        this.fetchActivities(intervalStart);
      }
    },
  },
};
</script>
<style>
.container {
  max-height: 600px;
}
.text-color-white {
  color: white;
}

.vuecal__event {
  background-color: #e0d988;
}
.vuecal__menu,
.vuecal__cell-events-count {
  background-color: #48447f;
  color: white;
}
.vuecal__title-bar {
  background-color: #e4f5ef;
}
.vuecal__flex .vuecal__weekdays-headings {
  color: white;
}
.vuecal__cell--today,
.vuecal__cell--current {
  background-color: rgba(240, 240, 255, 0.4);
}
.vuecal:not(.vuecal--day-view) {
  background-color: #052010;
}
/* .vuecal__cell--selected:before {border-color: rgba(66, 185, 131, 0.5);} */
/* Cells and buttons get highlighted when an event is dragged over it. */
.vuecal__cell--highlighted:not(.vuecal__cell--has-splits),
.vuecal__cell-split--highlighted {
  background-color: rgba(255, 255, 225, 1);
}
.vuecal__arrow.vuecal__arrow--highlighted,
.vuecal__view-btn.vuecal__view-btn--highlighted {
  background-color: rgba(136, 236, 191, 0.25);
}

.vuecal__cell-date {
  color: white;
}
</style>
