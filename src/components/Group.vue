<template>
  <div
    class="group"
    v-searchTerms="{
      terms: ['group'],
      title: name,
      type: 'Group',
      focusElement: true
    }"
    @focus="focus"
    @mousedown="focus"
    :class="{ focused }"
  >
    <div
      class="group__controls"
      :class="{ 'group__controls-hidden': !controlsShown }"
    >
      <grid columns="6">
        <c span="1..">
          <grid
            columns="6"
            @mousedown="focusInput(group.enabledInputId, 'Enable')"
            :class="{
              'has-link': hasLink(group.enabledInputId),
              focused: isFocused(group.enabledInputId)
            }"
          >
            <c span="2">Enable</c>
          </grid>
        </c>

        <c span="1..">
          <grid
            columns="6"
            @mousedown="focusInput(group.inheritInputId, 'Inherit')"
            :class="{
              'has-link': hasLink(group.inheritInputId),
              focused: isFocused(group.inheritInputId)
            }"
          >
            <c span="2">Inherit</c>
            <c span="4"
              ><Checkbox
                v-model="inherit"
                :class="{ light: isFocused(group.inheritInputId) }"
            /></c>
          </grid>
        </c>

        <c span="1..">
          <grid
            columns="6"
            @mousedown="focusInput(group.clearingInputId, 'Clearing')"
            :class="{
              'has-link': hasLink(group.clearingInputId),
              focused: isFocused(group.clearingInputId)
            }"
          >
            <c span="2">Clearing</c>
            <c span="4"
              ><Checkbox
                v-model="clearing"
                :class="{ light: isFocused(group.clearingInputId) }"
            /></c>
          </grid>
        </c>

        <c span="1..">
          <grid
            columns="6"
            @mousedown="focusInput(group.pipelineInputId, 'Pipeline')"
            :class="{
              'has-link': hasLink(group.pipelineInputId),
              focused: isFocused(group.pipelineInputId)
            }"
          >
            <c span="2">Pipeline</c>
            <c span="4"
              ><Checkbox
                v-model="pipeline"
                :class="{ light: isFocused(group.pipelineInputId) }"
            /></c>
          </grid>
        </c>

        <c span="1..">
          <grid
            columns="6"
            @mousedown="focusInput(group.alphaInputId, 'Alpha')"
            :class="{
              'has-link': hasLink(group.alphaInputId),
              focused: isFocused(group.alphaInputId)
            }"
          >
            <c span="2">Alpha</c>
            <c span="4">
              <Range value="1" max="1" step="0.001" v-model="alpha" />
            </c>
          </grid>
        </c>

        <c span="1..">
          <grid
            columns="6"
            @mousedown="
              focusInput(group.compositeOperationInputId, 'Blend Mode')
            "
            :class="{
              'has-link': hasLink(group.compositeOperationInputId),
              focused: isFocused(group.compositeOperationInputId)
            }"
          >
            <c span="2">Blend</c>
            <c span="4">
              <Select
                v-model="blendMode"
                :class="{ light: isFocused(group.compositeOperationInputId) }"
              >
                <optgroup
                  v-for="group in compositeOperations"
                  :label="group.label"
                  :key="group.label"
                >
                  <option
                    v-for="mode in group.children"
                    :value="mode.value"
                    :key="mode.label"
                    >{{ mode.label }}</option
                  >
                </optgroup>
              </Select>
            </c>
          </grid>
        </c>

        <!-- <c span="1..">
          <grid columns="6">
            <c span="2">Quality</c>
            <c span="4">
              <Select v-model="quality">
                <option value="full">Full</option>
                <option value="half">Half</option>
                <option value="quarter">Quarter</option>
                <option value="bad">Bad</option>
                <option value="awful">Awful</option>
              </Select>
            </c>
          </grid>
        </c> -->
      </grid>
    </div>
    <div class="group__left">
      <Checkbox class="group__enabledCheckbox" v-model="enabled" />
      <button
        class="group__controlsButton"
        :class="{ 'group__controlsButton-hidden': !controlsShown }"
        @click="controlsShown = !controlsShown"
      >
        <img :src="Arrow" />
      </button>
    </div>
    <div class="group__right">
      <div class="group__title" @click.self="endTitleEditable">
        <span v-if="!titleEditable" @dblclick="toggleTitleEditable">{{
          name
        }}</span>
        <TextInput
          v-model="localName"
          v-else
          @keypress.enter="endTitleEditable"
        />
      </div>
      <Container
        drag-handle-selector=".handle"
        orientation="horizontal"
        group-name="modules"
        :should-animate-drop="() => false"
        :get-child-payload="getChildPayload"
        tag="div"
        class="group__modules"
        @drop="onDrop"
      >
        <Draggable
          v-for="moduleId in modules"
          :key="moduleId"
          class="group__module"
        >
          <div class="group-module-container">
            <ActiveModule :id="moduleId" @remove-module="removeModule" />
          </div>
        </Draggable>
      </Container>
    </div>
  </div>

  <!-- <div

  >
    <section class="group-controls">
      <input
        type="range"
        v-model.number="alpha"
        max="1"
        min="0"
        step="0.001"
        class="group-alpha"
        @mousedown="focusInput(group.alphaInputId, 'Alpha')"
        :class="{
          'has-link': hasLink(group.alphaInputId),
          focused: isFocused(group.alphaInputId)
        }"
      />
      <select
        v-model="compositeOperation"
        class="group-composite-operation"
        @mousedown="
          focusInput(group.compositeOperationInputId, 'Composite Operation')
        "
        :class="{
          'has-link': hasLink(group.compositeOperationInputId),
          focused: isFocused(group.compositeOperationInputId)
        }"
      >
        <optgroup
          v-for="group in compositeOperations"
          :label="group.label"
          :key="group.label"
        >
          <option
            v-for="mode in group.children"
            :value="mode.value"
            :key="mode.label"
            >{{ mode.label }}</option
          >
        </optgroup>
      </select>
    </section>
    <section class="group-body">
      <div class="group-title" @click.self="endTitleEditable">
        <span v-if="!titleEditable" @dblclick="toggleTitleEditable">{{
          name
        }}</span>
        <input
          type="text"
          v-model="localName"
          v-else
          @keypress.enter="endTitleEditable"
        />
      </div>
      <Container
        drag-handle-selector=".handle"
        orientation="horizontal"
        group-name="modules"
        :should-animate-drop="() => false"
        :get-child-payload="getChildPayload"
        tag="div"
        class="group-modules"
        @drop="onDrop"
      >
        <Draggable
          v-for="moduleId in modules"
          :key="moduleId"
          class="group-module"
        >
          <div class="group-module-container">
            <ActiveModule :id="moduleId" @remove-module="removeModule" />
          </div>
        </Draggable>
      </Container>
    </section>
  </div> -->
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd";
import ActiveModule from "./ActiveModule";
import compositeOperations from "../util/composite-operations";
import Arrow from "../assets/graphics/Arrow.svg";

const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) {
    return arr;
  }

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};

export default {
  props: {
    groupId: {
      type: String,
      required: true
    }
  },

  components: {
    ActiveModule,
    Container,
    Draggable
  },

  data() {
    return {
      compositeOperations,
      titleEditable: false,
      localName: "",
      controlsShown: false,
      Arrow
    };
  },

  created() {
    this.localName = this.name;

    if (!this.focusedGroup) {
      this.focus();
    }
  },

  computed: {
    group() {
      return this.$modV.store.state.groups.groups.filter(
        group => group.id === this.groupId
      )[0];
    },

    name() {
      return this.group.name;
    },

    modules: {
      get() {
        return this.group.modules;
      },

      set(modules) {
        this.$modV.store.commit("groups/REPLACE_GROUP_MODULES", {
          groupId: this.groupId,
          modules
        });
      }
    },

    focusedGroup() {
      return this.$store.state["ui-groups"].focused;
    },

    focused() {
      return this.groupId === this.focusedGroup;
    },

    enabled: {
      get() {
        return this.group.enabled;
      },

      set(value) {
        this.$modV.store.commit("groups/UPDATE_GROUP", {
          groupId: this.groupId,
          data: {
            enabled: value
          }
        });
      }
    },

    inherit: {
      get() {
        return this.group.inherit;
      },

      set(value) {
        this.$modV.store.commit("groups/UPDATE_GROUP", {
          groupId: this.groupId,
          data: {
            inherit: value
          }
        });
      }
    },

    pipeline: {
      get() {
        return this.group.pipeline;
      },

      set(value) {
        this.$modV.store.commit("groups/UPDATE_GROUP", {
          groupId: this.groupId,
          data: {
            pipeline: value
          }
        });
      }
    },

    clearing: {
      get() {
        return this.group.clearing;
      },

      set(value) {
        this.$modV.store.commit("groups/UPDATE_GROUP", {
          groupId: this.groupId,
          data: {
            clearing: value
          }
        });
      }
    },

    alpha: {
      get() {
        return this.group.alpha;
      },

      set(value) {
        this.$modV.store.commit("groups/UPDATE_GROUP", {
          groupId: this.groupId,
          data: {
            alpha: value
          }
        });
      }
    },

    blendMode: {
      get() {
        return this.group.compositeOperation;
      },

      set(value) {
        this.$modV.store.commit("groups/UPDATE_GROUP", {
          groupId: this.groupId,
          data: {
            compositeOperation: value
          }
        });
      }
    }
  },

  methods: {
    async onDrop(e) {
      const { moduleName, collection } = e.payload;

      if (e.addedIndex === null && e.removedIndex === null) {
        return;
      }

      if (collection === "gallery") {
        const module = await this.$modV.store.dispatch(
          "modules/makeActiveModule",
          { moduleName }
        );

        this.$modV.store.commit("groups/ADD_MODULE_TO_GROUP", {
          moduleId: module.$id,
          groupId: this.groupId,
          position: e.addedIndex
        });
      } else if (collection === "layer") {
        e.payload = e.payload.moduleId;
        this.modules = applyDrag(this.modules, e);
      }
    },

    getChildPayload(e) {
      const moduleId = this.modules[e];

      return { moduleId, collection: "layer" };
    },

    focus() {
      if (!this.focused) {
        this.$store.commit("ui-groups/SET_FOCUSED", this.groupId);
      }
    },

    removeModule(moduleId) {
      const { groupId } = this;

      this.$modV.store.commit("groups/REMOVE_MODULE_FROM_GROUP", {
        moduleId,
        groupId
      });

      this.$modV.store.commit("modules/REMOVE_ACTIVE_MODULE", {
        moduleId
      });
    },

    toggleTitleEditable() {
      this.titleEditable = !this.titleEditable;
    },

    endTitleEditable() {
      const { localName } = this;
      const trimmedName = localName.trim();

      if (trimmedName.length > 0) {
        this.$modV.store.commit("groups/UPDATE_GROUP", {
          groupId: this.groupId,
          data: {
            name: trimmedName
          }
        });
      } else {
        this.localName = this.name;
      }

      this.titleEditable = false;
    },

    focusInput(id, title) {
      this.$modV.store.dispatch("inputs/setFocusedInput", {
        id,
        title: `${this.name}: ${title}`
      });
    },
    hasLink(id) {
      return this.$modV.store.state.inputs.inputLinks[id];
    },

    isFocused(id) {
      return this.$modV.store.state.inputs.focusedInput.id === id;
    }
  },

  watch: {
    name(value) {
      this.localName = value;
    }
  }
};
</script>

<style scoped>
.group {
  font-size: 14px;
  display: flex;
  width: 100%;
  margin-bottom: 8px;
}

.group.focused {
  outline: #c4c4c4 2px solid;
}

.group__body {
  display: flex;
  width: 100%;
}

.group__left {
  background: #363636;
  box-sizing: border-box;
  display: flex;
  padding: 8px;
  width: 32px;

  flex-direction: column;
}

.group__right {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.group__enabledCheckbox {
  position: relative;
  z-index: 1;
}

.group__controlsButton {
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  height: 100%;
  margin-top: -16px;

  display: flex;
  align-items: center;
}

.group__controlsButton:focus {
  outline: none;
}

.group__controlsButton-hidden {
  transform: rotate(180deg);
}

.group__modules {
  background: #484848;
  padding: 8px;
  overflow-x: scroll;
  white-space: nowrap;
  display: block !important;
  flex: 1;
}

.group__module {
  display: inline-block !important;
}

.group__modules > * {
  flex-shrink: 0;
  display: inline-block;
}

.group__modules > * + * {
  position: relative;
  margin-left: 24px;
}

.group__modules > * + *::before {
  background-image: url(../assets/graphics/Arrow.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 50%;

  content: "";
  position: absolute;
  transform: rotate(180deg);
  left: -18px;
  height: 100%;
  width: 13px;
  display: flex;
  align-items: center;
}

.group__title {
  background: #363636;
  color: white;
  padding: 8px;
  line-height: 1;
}

.group__title input {
  max-width: 120px;
}

.group__controls {
  background: #363636;
  color: white;
  padding: 0;
  box-sizing: border-box;
  flex-shrink: 0;
}

.group__controls grid {
  grid-row-gap: 0;
  grid-column-gap: 0;
}

.group__controls c {
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

.group__controls > grid {
  padding: 4px 0;
}

.group__controls c grid {
  padding: 4px 8px;
  width: 100%;
}

.group__controls .focused {
  background: #151515;
  color: #ffffff;
}

.group__controls-hidden {
  padding-left: 0;
  padding-right: 0;
  width: 0;
  overflow: hidden;
}
</style>
