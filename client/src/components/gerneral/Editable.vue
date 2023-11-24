<template>
  <div id="edita">
    <v-text-field
      hide-details
      :outlined="!valid"
      :solo="valid"
      :flat="valid"
      :background-color="$vuetify.theme.currentTheme.editable"
      ref="edit"
      v-show="edit"
      :placeholder="placeholder"
      :value="valueLocal"
      class="editable"
      style="width: calc(100% - 2px); min-height: 25px !important;"
      @blur="onBlur"
    />
    <!-- :rules="required ? [rules.required] : []" -->
  </div>
</template>

<script>
//import { bus } from "@/main.js";

export default {
  data() {
    return {
      valid: true,
      edit: true,
      valueLocal: this.value,

      rules: {
        required: value => !!value || "Required.",
        min: v => (v && v.length >= 6) || "Min 6 characters"
      }
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
    },
    required: {
      type: Boolean,
      default: () => false
    }
  },

  watch: {
    value: function() {
      this.valueLocal = this.value;
    }
  },

  methods: {
    onBlur() {
      this.valid = this.$refs.edit.validate();
      this.valueLocal = this.$refs.edit.internalValue;
      this.func();
    },
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
  font-size: inherit;
  line-height: normal !important;
}
.editable:hover {
  cursor: text !important;
}

#edita >>> .v-input__control {
  min-height: 0px !important;
}

#edita >>> .v-input__slot {
  min-height: 0px !important;
}

#edita >>> .v-text-field input {
  padding: 3px 0 3px;
}
</style>
