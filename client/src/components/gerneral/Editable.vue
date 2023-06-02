<template>
  <div>
    <!-- @blur="valueLocal = $event.target.value; func()"   v-on:dblclick="dblclick"-->
    <input
      type="text"
      ref="edit"
      v-show="edit"
      :placeholder="placeholder"
      :value="valueLocal"
      :class="'editable '"
      style="width: calc(100% - 2px); margin:1px;padding-left:4px;"
      @blur="
        valueLocal = $event.target.value;
        func();
      "
      @keydown.enter="handleEnter"
    />
    <!-- v-show="edit" edit = false; 
      valueLocal = $event.target.value;
        func2();
    <div
      v-show="!edit"
      v-on:click="click"
      :class="'editable '+getClass"
      style="min-width: 100px; border-radius: 5px;"
    >
      {{ valueLocal }}
    </div>-->
  </div>
</template>

<script>
//import { bus } from "@/main.js";

export default {
  data() {
    return {
      edit: true,
      valueLocal: this.value
    };
  },
  props: {
    type: {
      type: String,
      default: () => {}
    },
    value: {
      type: String,
      default: () => {}
    },
    id: {
      type: Number,
      default: () => {}
    },
    field: {
      type: String,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: () => {}
    },
    size: {
      type: String,
      default: () => {}
    }
  },

  watch: {
    value: function() {
      this.valueLocal = this.value;
    }
  },

  methods: {
    click() {
      this.edit = true;
      setTimeout(() => {
        this.$refs.edit.focus();
      }, 100);
    },
    func() {
      //this.edit = false;
      this.$emit("input", {
        value: this.valueLocal,
        type: this.type,
        field: this.field,
        id: this.id
      });
    },
    func2() {
      this.edit = false;
      this.edit = true;
    },
    handleEnter() {
      // Handle Enter key press
      // ...
      this.$refs.edit.blur(); // Remove focus from input element
    }
  },

  computed: {}
};
</script>

<style scoped>
.editable {
  background-color: rgb(226, 226, 226);
  font-size: inherit;
  padding: 1px;
  border-radius: 5px;
}
.editable:hover {
  cursor: text !important;
}
</style>
