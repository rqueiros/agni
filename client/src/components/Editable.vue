<template>
    <div>
        <!-- @blur="valueLocal = $event.target.value; func()"-->
        <input type="text" :value="valueLocal" class="editable" ref="edit" v-show="edit" style="width:100%; font-size: 1vw;"
            @blur="valueLocal = $event.target.value; func()" @keydown.enter="valueLocal = $event.target.value; edit = false;"/>
        <div v-show="!edit" v-on:dblclick="dblclick" class="editable" style="padding:1px;min-width: 100px;border-radius: 5px; font-size: 1vw;">
            {{ valueLocal }}
        </div>
    </div>
</template>
  
<script>
//import { bus } from "@/main.js";

export default {

    data() {
        return {
            edit: false,
            valueLocal: this.value,

        }
    },
    props: {
        type: {
            type: String,
            default: () => { }
        },
        value: {
            type: String,
            default: () => { }
        },
        id: {
            type: Number,
            default: () => { }
        },
        field: {
            type: String,
            default: () => { }
        }
    },

    watch: {
        value: function () {
            this.valueLocal = this.value;
        }
    },

    methods: {
        dblclick() {
            this.edit = true;
            setTimeout(() => {
                this.$refs.edit.focus();
            }, 100);
        },
        func() {
            this.edit = false;
            this.$emit('input', {value:this.valueLocal, type:this.type, field:this.field, id:this.id});
        }
    }

}
</script>

<style>
.editable {
    background-color: lightgrey;
}
</style>