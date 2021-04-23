<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <vue-cal
          locale="pt-br"
          class="container"
          :disable-views="['years', 'year']"
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
                      <v-text-field v-model="data.name" outlined></v-text-field>
                    </v-col>

                    <v-col class="mt-n8" cols="12">
                      <label class="ml-1 font-weight-medium">Descrição</label>
                      <v-textarea
                        v-model="data.description"
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
                            :return-value.sync="data.startDate"
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
                              v-model="data.startDate"
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
                                @click="$refs.menu.save(data.startDate)"
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
                                :return-value.sync="data.startTime"
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
                                    v-model="data.startTime"
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
                                  v-model="data.startTime"
                                  :max="data.endTime"
                                  full-width
                                  @click:minute="
                                    $refs.startMenu.save(data.startTime)
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
                                :return-value.sync="data.endTime"
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
                                    v-model="data.endTime"
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
                                  v-model="data.endTime"
                                  :min="data.startTime"
                                  full-width
                                  @click:minute="
                                    $refs.endMenu.save(data.endTime)
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
    data: {
      name: '',
      description: '',
      startTime: null,
      endTime: null,
      startDate: '',
      endDate: null,
    },
  }),
  computed: {
    brDateText() {
      return this.data.startDate
        .split('-')
        .reverse()
        .join('/');
    },
  },
  methods: {
    save() {
      const temp = this.data.startDate.split('-');
      const date = new Date(temp[0], temp[1] - 1, temp[2]);
      console.log('atual: ', date);
      const newDateInMillis = date.getTime() +  1000 * 60 * 60 * 24 * 7 * this.weeks; 
      console.log('Daqui a 8 dias: ', new Date(newDateInMillis));
    },
    calculateEndDate(){

    }
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
